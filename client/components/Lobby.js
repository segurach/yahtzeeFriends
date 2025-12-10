import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes, themeKeys, getButtonTextColor } from '../utils/themes';
import PlayerGuide from './PlayerGuide';
import AdModal from './AdModal';

export default function Lobby({
    language,
    setLanguage,
    currentTheme,
    setCurrentTheme,
    theme,
    t,
    isMusicEnabled,
    toggleMusic,
    isConnected,
    currentRoom,
    playerName,
    setPlayerName,
    roomCode,
    setRoomCode,
    createRoom,
    createBotGame,
    joinRoom,
    leaveGame,
    startGame,
    players,
    level = 1,
    totalXP = 0,
    currentDiceSkin,
    setCurrentDiceSkin,
    showModal,
    setShowSettings // New prop
}) {
    const themeNames = {
        darkBlue: 'themeDarkBlue',
        darkPurple: 'themePurple',
        forestGreen: 'themeGreen',
        sunsetOrange: 'themeSunset',
        highContrast: 'themeHighContrast',
        legendary: 'themeLegendary',
    };

    // XP calculation
    const currentLevelXP = totalXP % 1000;
    const xpProgress = (currentLevelXP / 1000) * 100;

    // Title Logic
    const getTitle = (lvl) => {
        if (lvl >= 50) return t('titleLegend');
        if (lvl >= 20) return t('titleMaster');
        if (lvl >= 10) return t('titleHighRoller');
        if (lvl >= 5) return t('titleRoller');
        return t('titleNovice');
    };

    const [showGuide, setShowGuide] = useState(false);
    const [showAd, setShowAd] = useState(false);

    const handleAdReward = () => {
        // Just a thank you in the modal is enough for now
    };

    return (
        <View style={styles.centerContent}>
            {/* Help Button (Top Left) */}
            <TouchableOpacity
                style={styles.helpButton}
                onPress={() => setShowGuide(true)}
            >
                <Ionicons name="help-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowSettings(true)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Settings"
                accessibilityHint="Opens customization menu"
            >
                <Ionicons name="settings-outline" size={30} color="#fff" />
            </TouchableOpacity>

            <Text
                style={styles.title}
                accessible={true}
                accessibilityRole="header"
            >
                {t('title')}
            </Text>

            {/* XP Profile Section */}
            <View style={styles.profileContainer}>
                <View style={{ alignItems: 'center', marginRight: 15 }}>
                    <Text style={styles.levelBadge}>LVL {level}</Text>
                    <Text style={styles.playerTitle}>{getTitle(level)}</Text>
                </View>
                <View style={styles.xpInfo}>
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: `${xpProgress}%`, backgroundColor: theme.accent }]} />
                    </View>
                    <Text style={styles.xpText}>{currentLevelXP} / 1000 XP</Text>
                </View>
            </View>

            <Text
                style={{ color: isConnected ? '#4caf50' : '#f44336', marginBottom: 20, fontWeight: 'bold' }}
                accessible={true}
                accessibilityRole="text"
                accessibilityLiveRegion="polite"
            >
                {isConnected ? t('connectedToServer') : t('disconnected')}
            </Text>

            {
                !currentRoom ? (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={t('yourName')}
                            placeholderTextColor="#999"
                            value={playerName}
                            onChangeText={setPlayerName}
                            accessible={true}
                            accessibilityLabel={t('yourName')}
                            accessibilityHint="Enter your player name"
                        />
                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: theme.accent }]}
                            onPress={createRoom}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t('createRoom')}
                            accessibilityHint="Creates a new game room"
                        >
                            <Text style={[styles.buttonText, { color: getButtonTextColor(theme.accent) }]}>{t('createRoom')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: '#795548', marginTop: 10 }]}
                            onPress={createBotGame}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t('playVsBot') || "Play vs Bot"}
                            accessibilityHint="Starts a game against the computer"
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('playVsBot') || "Play vs Bot 🤖"}</Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TextInput
                            style={styles.input}
                            placeholder={t('roomCode')}
                            placeholderTextColor="#999"
                            value={roomCode}
                            onChangeText={setRoomCode}
                            autoCapitalize="characters"
                            accessible={true}
                            accessibilityLabel={t('roomCode')}
                            accessibilityHint="Enter the room code to join"
                        />
                        <TouchableOpacity
                            style={[styles.secondaryButton, { backgroundColor: theme.secondary }]}
                            onPress={joinRoom}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t('joinRoom')}
                            accessibilityHint="Joins an existing game room"
                        >
                            <Text style={[styles.buttonText, { color: getButtonTextColor(theme.secondary) }]}>{t('joinRoom')}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text
                            style={[styles.roomCode, { color: theme.accentLight }]}
                            accessible={true}
                            accessibilityRole="text"
                            accessibilityLabel={`${t('room')}: ${currentRoom}`}
                        >
                            {t('room')}: {currentRoom}
                        </Text>
                        <Text
                            style={styles.subtitle}
                            accessible={true}
                            accessibilityRole="header"
                        >
                            {t('players')}
                        </Text>
                        {players.map((p, i) => (
                            <Text
                                key={i}
                                style={styles.player}
                                accessible={true}
                                accessibilityRole="text"
                            >
                                {p.name}
                            </Text>
                        ))}
                        <View style={styles.separator} />
                        <TouchableOpacity
                            style={[styles.primaryButton, { backgroundColor: theme.accent }]}
                            onPress={startGame}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t('startGame')}
                            accessibilityHint="Starts the game with current players"
                        >
                            <Text style={[styles.buttonText, { color: getButtonTextColor(theme.accent) }]}>{t('startGame')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.secondaryButton, { backgroundColor: theme.error || '#d32f2f', marginTop: 10 }]}
                            onPress={leaveGame}
                            accessible={true}
                            accessibilityRole="button"
                            accessibilityLabel={t('leaveRoom')}
                            accessibilityHint="Leaves the current room and returns to lobby"
                        >
                            <Text style={[styles.buttonText, { color: '#fff' }]}>{t('leaveRoom')}</Text>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 10 }}
                            onPress={() => setShowAd(true)}
                        >
                            <Ionicons name="heart" size={20} color="#ff4081" style={{ marginRight: 5 }} />
                            <Text style={{ color: '#aaa', textDecorationLine: 'underline' }}>{t('supportDev')}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }


            <PlayerGuide
                visible={showGuide}
                onClose={() => setShowGuide(false)}
                theme={theme}
                t={t}
            />

            <AdModal
                visible={showAd}
                onClose={() => setShowAd(false)}
                onReward={handleAdReward}
                t={t}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 20,
        marginBottom: 20,
    },
    levelBadge: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        // marginRight: 10, // Removed as it's now in a container with margin
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    playerTitle: {
        fontSize: 10,
        color: '#ffd700',
        fontWeight: 'bold',
        marginTop: 2,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    xpInfo: {
        flexDirection: 'column',
    },
    xpBarBg: {
        width: 150,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    xpText: {
        color: '#ccc',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e8eaf6',
        marginBottom: 10,
        textAlign: 'center',
    },
    player: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 5,
    },
    roomCode: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffeb3b', // Yellow
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        maxWidth: 300,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        height: 30,
    },
    primaryButton: {
        backgroundColor: '#ff6f00', // Amber/Orange
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    secondaryButton: {
        backgroundColor: '#5c6bc0', // Lighter Blue
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Modal Styles
    settingsButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        zIndex: 10,
    },
    helpButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        zIndex: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
