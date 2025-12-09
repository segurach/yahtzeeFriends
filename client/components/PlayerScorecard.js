import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';

export default function PlayerScorecard({ player, visible, onClose, t }) {
    if (!player) return null;

    const UPPER_SECTION = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
    const LOWER_SECTION = [
        'three_of_a_kind', 'four_of_a_kind', 'full_house',
        'small_straight', 'large_straight', 'chance', 'yahtzee'
    ];

    const scorecard = player.scorecard || {};

    const calculateSectionSum = (section) => {
        return section.reduce((total, category) => {
            return total + (scorecard[category] || 0);
        }, 0);
    };

    const upperSum = calculateSectionSum(UPPER_SECTION);
    const lowerSum = calculateSectionSum(LOWER_SECTION);
    const bonus = upperSum >= 63 ? 35 : 0;
    const upperTotal = upperSum + bonus;
    const grandTotal = upperTotal + lowerSum;

    const renderCategoryRow = (category) => {
        const score = scorecard[category];
        const isFilled = score !== undefined;
        return (
            <View
                key={category}
                style={[styles.categoryRow, isFilled && styles.filledRow]}
            >
                <Text style={styles.categoryLabel}>{t(category)}</Text>
                <Text style={[styles.categoryScore, !isFilled && styles.emptyScore]}>
                    {isFilled ? score : '-'}
                </Text>
            </View>
        );
    };

    const renderSummaryRow = (label, value, isBonus = false) => (
        <View style={[styles.summaryRow, isBonus && styles.bonusRow]}>
            <Text style={[styles.summaryLabel, isBonus && { color: '#ffd700' }]}>{label}</Text>
            <Text style={[styles.summaryValue, isBonus && { color: '#ffd700' }]}>{value}</Text>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.playerName}>{player.name}</Text>
                        <Text style={styles.totalScore}>{t('total')}: {grandTotal}</Text>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {/* Upper Section */}
                        <Text style={styles.sectionHeader}>{t('upperSection')}</Text>
                        <View style={styles.sectionContainer}>
                            {UPPER_SECTION.map(renderCategoryRow)}
                            <View style={styles.divider} />
                            {renderSummaryRow(t('subtotal'), `${upperSum}/63`)}
                            {renderSummaryRow(t('bonus'), bonus, true)}
                            {renderSummaryRow(t('upperTotal'), upperTotal)}
                        </View>

                        {/* Lower Section */}
                        <Text style={styles.sectionHeader}>{t('lowerSection')}</Text>
                        <View style={styles.sectionContainer}>
                            {LOWER_SECTION.map(renderCategoryRow)}
                            <View style={styles.divider} />
                            {renderSummaryRow(t('lowerTotal'), lowerSum)}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>{t('closeScorecard')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        marginBottom: 15,
        alignItems: 'center',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    playerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    totalScore: {
        fontSize: 18,
        color: '#ffd700',
        fontWeight: 'bold',
    },
    scrollView: {
        marginBottom: 10,
    },
    sectionHeader: {
        color: '#aaa',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    sectionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
        padding: 10,
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    filledRow: {
        // backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    categoryLabel: {
        fontSize: 14,
        color: '#ddd',
    },
    categoryScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        minWidth: 30,
        textAlign: 'right',
    },
    emptyScore: {
        color: '#555',
        fontWeight: 'normal',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    bonusRow: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        marginHorizontal: -10,
        paddingHorizontal: 10,
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#bbb',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#444',
        marginVertical: 5,
    },
    closeButton: {
        backgroundColor: '#2e7d32',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
