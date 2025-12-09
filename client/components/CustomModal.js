import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

export default function CustomModal({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
    type = 'info', // info, error, success, confirm
    theme
}) {
    if (!visible) return null;

    // Colors based on type
    let headerColor = theme?.primary || '#2e7d32';
    if (type === 'error') headerColor = '#d32f2f';
    if (type === 'success') headerColor = '#ed6c02'; // Gold/Orange for rewards

    // For specific themes handled in the app, we might want to stick to the active theme colors
    // but allow overriding for 'error' states.

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onCancel || onConfirm}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { borderColor: theme?.accent || '#fff' }]}>
                    <View style={[styles.header, { backgroundColor: headerColor }]}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.message}>{message}</Text>
                    </View>

                    <View style={styles.footer}>
                        {onCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: type === 'error' ? '#d32f2f' : (theme?.accent || '#2e7d32') }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={[
                                styles.confirmButtonText,
                                // Ensure text is black if button is bright yellow/gold
                                (theme?.accent === '#FFFF00' || theme?.accent === '#ffeb3b') ? { color: 'black' } : {}
                            ]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: '#1a1a1a', // Dark generic background
        borderRadius: 20,
        borderWidth: 2,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    header: {
        padding: 15,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        color: '#eee',
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
        gap: 15, // React Native 0.71+ support gap
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        minWidth: 100,
        alignItems: 'center',
    },
    confirmButton: {
        elevation: 3,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#aaa',
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButtonText: {
        color: '#aaa',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
