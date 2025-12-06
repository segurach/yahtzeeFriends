import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ScoreRow = ({ label, score, previewScore, isFilled, onPress, disabled, isTotal }) => {
    return (
        <TouchableOpacity
            style={[
                styles.scoreRow,
                isFilled && styles.scoreRowFilled,
                isTotal && styles.totalRow
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[
                styles.scoreLabel,
                isTotal && { fontWeight: 'bold', fontSize: 20 }
            ]}>
                {label}
            </Text>
            <Text style={[
                isFilled ? styles.scoreValue : styles.scorePreview,
                isTotal && { fontWeight: 'bold', fontSize: 24 }
            ]}>
                {isFilled ? score : (previewScore !== null ? previewScore : '-')}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '48%',
        marginBottom: 10,
        elevation: 2,
    },
    scoreRowFilled: {
        backgroundColor: '#e0e0e0',
        opacity: 0.8,
    },
    totalRow: {
        width: '100%',
        backgroundColor: '#ffeb3b', // Yellow for total
        marginTop: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#fbc02d',
        elevation: 6,
    },
    scoreLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#333',
        flex: 1, // Allow text to wrap if needed
    },
    scoreValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    scorePreview: {
        fontSize: 15,
        color: '#9e9e9e', // Grey for preview
        fontStyle: 'italic',
    },
});

export default ScoreRow;
