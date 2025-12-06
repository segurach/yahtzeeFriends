import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function Leaderboard({ players, currentTurnId, myId, onPlayerPress, t }) {
    // Sort players by score (highest first)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('leaderboard')}</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {sortedPlayers.map((player, index) => {
                    const isMe = player.id === myId;
                    const isCurrentTurn = player.id === currentTurnId;
                    const isFirst = index === 0;

                    return (
                        <TouchableOpacity
                            key={player.id}
                            style={[
                                styles.playerCard,
                                isMe && styles.myPlayerCard,
                                isCurrentTurn && styles.currentTurnCard,
                            ]}
                            onPress={() => onPlayerPress(player)}
                        >
                            <Text style={[styles.playerName, isMe && styles.myPlayerName]}>
                                {isFirst && '👑 '}
                                {player.name}
                                {isCurrentTurn && ' 🎲'}
                            </Text>
                            <Text style={[styles.playerScore, isMe && styles.myPlayerScore]}>
                                {player.score}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
        width: '100%',
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e8eaf6',
        marginBottom: 6,
        textAlign: 'center',
    },
    scrollContent: {
        gap: 8,
        paddingHorizontal: 4,
    },
    playerCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        minWidth: 80,
    },
    myPlayerCard: {
        backgroundColor: 'rgba(92, 107, 192, 0.3)',
    },
    currentTurnCard: {
        borderColor: '#ff6f00',
    },
    playerName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
        marginBottom: 4,
        textAlign: 'center',
    },
    myPlayerName: {
        fontWeight: 'bold',
        color: '#ffeb3b',
    },
    playerScore: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    myPlayerScore: {
        color: '#ffeb3b',
    },
});
