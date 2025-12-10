// Helper to calculate score (copied from server.js to allow independent testing/usage)
function calculatePossibleScore(category, dice) {
    const counts = {};
    dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const sum = dice.reduce((a, b) => a + b, 0);
    const uniqueDice = [...new Set(dice)].sort((a, b) => a - b);

    const isConsecutive = (arr) => {
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i + 1] !== arr[i] + 1) return false;
        }
        return true;
    };

    let hasSmallStraight = false;
    if (uniqueDice.length >= 4) {
        for (let i = 0; i <= uniqueDice.length - 4; i++) {
            if (isConsecutive(uniqueDice.slice(i, i + 4))) hasSmallStraight = true;
        }
    }
    const hasLargeStraight = uniqueDice.length === 5 && isConsecutive(uniqueDice);

    switch (category) {
        case 'ones': return (counts[1] || 0) * 1;
        case 'twos': return (counts[2] || 0) * 2;
        case 'threes': return (counts[3] || 0) * 3;
        case 'fours': return (counts[4] || 0) * 4;
        case 'fives': return (counts[5] || 0) * 5;
        case 'sixes': return (counts[6] || 0) * 6;
        case 'three_of_a_kind': return Object.values(counts).some(c => c >= 3) ? sum : 0;
        case 'four_of_a_kind': return Object.values(counts).some(c => c >= 4) ? sum : 0;
        case 'full_house':
            const values = Object.values(counts);
            return (values.includes(3) && values.includes(2)) || values.includes(5) ? 25 : 0;
        case 'small_straight': return hasSmallStraight ? 30 : 0;
        case 'large_straight': return hasLargeStraight ? 40 : 0;
        case 'chance': return sum;
        case 'yahtzee': return Object.values(counts).includes(5) ? 50 : 0;
        default: return 0;
    }
}

function getBotMove(dice, rollsLeft, scorecard) {
    // 0. If dice are all 0 (start of turn), roll everything
    if (dice.every(d => d === 0)) {
        return { action: 'roll', keptIndices: [] };
    }

    // 1. Analyze current dice
    const counts = {};
    dice.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const values = Object.values(counts);
    const keys = Object.keys(counts).map(Number);
    const sum = dice.reduce((a, b) => a + b, 0);

    // Check available categories
    const isAvailable = (cat) => scorecard[cat] === undefined;

    // --- LOGIC PHASE 1: Immediate Wins / High Value targets ---

    // Yahtzee (5 of a kind)
    if (values.includes(5) && isAvailable('yahtzee')) {
        return { action: 'submit', category: 'yahtzee' };
    }

    // Large Straight
    if (calculatePossibleScore('large_straight', dice) === 40 && isAvailable('large_straight')) {
        return { action: 'submit', category: 'large_straight' };
    }

    // Full House
    if (calculatePossibleScore('full_house', dice) === 25 && isAvailable('full_house')) {
        return { action: 'submit', category: 'full_house' };
    }

    // --- LOGIC PHASE 2: Rolling Strategy (if rolls left > 0) ---
    if (rollsLeft > 0) {
        // Try for Yahtzee / 4 of a kind / 3 of a kind
        const mostCommonNum = keys.reduce((a, b) => counts[a] > counts[b] ? a : b);
        const countOfMostCommon = counts[mostCommonNum];

        if (countOfMostCommon >= 3 && isAvailable('four_of_a_kind')) {
            return { action: 'roll', keptIndices: dice.map((d, i) => d === mostCommonNum ? i : -1).filter(i => i !== -1) };
        }

        if (countOfMostCommon >= 2) {
            // Keep the pair/triplet
            return { action: 'roll', keptIndices: dice.map((d, i) => d === mostCommonNum ? i : -1).filter(i => i !== -1) };
        }

        // Check for small straight potential (consecutive sequences of 3+)
        // Simple heuristic: keep dice that form a sequence
        const uniqueSorted = [...new Set(dice)].sort((a, b) => a - b);
        let longestSeq = [];
        let currentSeq = [];
        for (let i = 0; i < uniqueSorted.length; i++) {
            if (currentSeq.length === 0 || uniqueSorted[i] === currentSeq[currentSeq.length - 1] + 1) {
                currentSeq.push(uniqueSorted[i]);
            } else {
                if (currentSeq.length > longestSeq.length) longestSeq = currentSeq;
                currentSeq = [uniqueSorted[i]];
            }
        }
        if (currentSeq.length > longestSeq.length) longestSeq = currentSeq;

        if (longestSeq.length >= 3 && (isAvailable('small_straight') || isAvailable('large_straight'))) {
            // Keep the sequence
            return { action: 'roll', keptIndices: dice.map((d, i) => longestSeq.includes(d) ? i : -1).filter(i => i !== -1) };
        }

        // Default: Keep highest dice (4, 5, 6) if Chance or Numbers are open
        const highDiceIndices = dice.map((d, i) => d >= 4 ? i : -1).filter(i => i !== -1);
        if (highDiceIndices.length > 0 && highDiceIndices.length < 5) { // Don't keep all if random
            return { action: 'roll', keptIndices: highDiceIndices };
        }

        // Totally random re-roll everything
        return { action: 'roll', keptIndices: [] };
    }

    // --- LOGIC PHASE 3: Forced Submission (rollsLeft === 0) ---

    // 1. Take anything that gives points
    const priorities = [
        'yahtzee', 'large_straight', 'small_straight', 'full_house',
        'sixes', 'fives', 'four_of_a_kind', 'three_of_a_kind', 'fours', 'threes', 'twos', 'ones', 'chance'
    ];

    for (const cat of priorities) {
        if (isAvailable(cat)) {
            const score = calculatePossibleScore(cat, dice);
            if (score > 0) return { action: 'submit', category: cat };
        }
    }

    // 2. Dump into Chance if available
    if (isAvailable('chance')) return { action: 'submit', category: 'chance' };

    // 3. Scratch (0 points) - Find lowest value category to sacrifice
    // Order of sacrifice: Ones > Twos > Threes > Yahtzee (if 0) > 4kind > 3kind
    const sacrificeOrder = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'yahtzee', 'four_of_a_kind', 'three_of_a_kind', 'full_house', 'small_straight', 'large_straight'];

    for (const cat of sacrificeOrder) {
        if (isAvailable(cat)) return { action: 'submit', category: cat };
    }

    // Should not happen if game is running correctly
    return { action: 'hold' };
}

module.exports = { getBotMove };
