import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PlayerGuide({ visible, onClose, theme, t }) {
    const [activeTab, setActiveTab] = useState('rules'); // rules, scoring, xp

    const renderTabButton = (id, label, icon) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === id && { backgroundColor: theme.accent }]}
            onPress={() => setActiveTab(id)}
        >
            <Ionicons name={icon} size={20} color={activeTab === id ? '#000' : '#fff'} />
            <Text style={[styles.tabText, activeTab === id && { color: '#000', fontWeight: 'bold' }]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.primary, borderColor: theme.accent }]}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('playerGuide') || 'Game Guide'}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        {renderTabButton('rules', t('rules') || 'Rules', 'book-outline')}
                        {renderTabButton('scoring', t('scores') || 'Scoring', 'list-outline')}
                        {renderTabButton('xp', t('progression') || 'XP', 'star-outline')}
                    </View>

                    {/* Content */}
                    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>

                        {activeTab === 'rules' && (
                            <View>
                                <SectionTitle text={t('howToPlay') || "How to Play"} theme={theme} />
                                <GuideText>1. {t('rule1') || "Roll the dice up to 3 times per turn."}</GuideText>
                                <GuideText>2. {t('rule2') || "Tap dice to keep them between rolls."}</GuideText>
                                <GuideText>3. {t('rule3') || "Fill one category on your scorecard each turn."}</GuideText>
                                <GuideText>4. {t('rule4') || "The game ends when all categories are filled."}</GuideText>
                                <GuideText>5. {t('rule5') || "The player with the highest total score wins!"}</GuideText>
                            </View>
                        )}

                        {activeTab === 'scoring' && (
                            <View>
                                <SectionTitle text={t('scoringSystem') || "Scoring System"} theme={theme} />

                                <ScoreRow label="1-6" desc={t('descNumbers') || "Sum of specific number"} pts="Sum" />
                                <ScoreRow label={t('bonus') || "Bonus"} desc={t('descBonus') || "Upper section > 63 pts"} pts="+35" />

                                <View style={styles.divider} />

                                <ScoreRow label={t('threeOfAKind') || "3 of a Kind"} desc={t('desc3Kind') || "3 same dice"} pts="Sum of all" />
                                <ScoreRow label={t('fourOfAKind') || "4 of a Kind"} desc={t('desc4Kind') || "4 same dice"} pts="Sum of all" />
                                <ScoreRow label={t('fullHouse') || "Full House"} desc={t('descFullHouse') || "3 of one + 2 of another"} pts="25" />
                                <ScoreRow label={t('smallStraight') || "Small Straight"} desc={t('descSmStraight') || "4 consecutive dice"} pts="30" />
                                <ScoreRow label={t('largeStraight') || "Large Straight"} desc={t('descLgStraight') || "5 consecutive dice"} pts="40" />
                                <ScoreRow label={t('yahtzee')} desc={t('descYahtzee') || "5 same dice"} pts="50" />
                                <ScoreRow label={t('chance') || "Chance"} desc={t('descChance') || "Any combination"} pts="Sum of all" />
                            </View>
                        )}

                        {activeTab === 'xp' && (
                            <View>
                                <SectionTitle text={t('xpAndLevels') || "XP & Levels"} theme={theme} />
                                <GuideText>{t('xpIntro') || "Earn XP to level up and unlock new dice skins and UI themes!"}</GuideText>

                                <View style={{ marginTop: 20 }}>
                                    <XPRow label={t('participation') || "Participation"} xp="+50 XP" emoji="🎮" />
                                    <XPRow label={t('victory') || "Victory"} xp="+100 XP" emoji="🏆" />
                                    <XPRow label={t('highScore') || "Score > 200"} xp="+50 XP" emoji="🎯" />
                                    <XPRow label={t('yahtzee')} xp="+50 XP" emoji="🎲" />
                                </View>

                                <View style={[styles.infoBox, { borderColor: theme.accent }]}>
                                    <Text style={[styles.infoText, { color: theme.accent }]}>
                                        {t('levelUpTip') || "Tip: Reach Level 10 to unlock the Golden Dice!"}
                                    </Text>
                                </View>
                            </View>
                        )}

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const SectionTitle = ({ text, theme }) => (
    <Text style={[styles.sectionTitle, { color: theme.accent }]}>{text}</Text>
);

const GuideText = ({ children }) => (
    <Text style={styles.text}>• {children}</Text>
);

const ScoreRow = ({ label, desc, pts }) => (
    <View style={styles.row}>
        <View style={{ flex: 1 }}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowDesc}>{desc}</Text>
        </View>
        <Text style={styles.rowPts}>{pts}</Text>
    </View>
);

const XPRow = ({ label, xp, emoji }) => (
    <View style={styles.xpRow}>
        <Text style={styles.xpEmoji}>{emoji}</Text>
        <Text style={styles.xpLabel}>{label}</Text>
        <Text style={styles.xpValue}>{xp}</Text>
    </View>
);

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.9,
        height: height * 0.8,
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        padding: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        gap: 8,
    },
    tabText: {
        color: '#ccc',
        fontSize: 14,
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    text: {
        color: '#eee',
        fontSize: 16,
        marginBottom: 12,
        lineHeight: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 8,
    },
    rowLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    rowDesc: {
        color: '#aaa',
        fontSize: 12,
    },
    rowPts: {
        color: '#ffd700',
        fontWeight: 'bold',
        fontSize: 18,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 10,
    },
    xpRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 15,
        borderRadius: 12,
    },
    xpEmoji: {
        fontSize: 24,
        marginRight: 15,
    },
    xpLabel: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    xpValue: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: 18,
    },
    infoBox: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    infoText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
    }
});
