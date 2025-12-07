export const themes = {
    darkBlue: {
        name: 'Dark Blue',
        primary: '#1a237e',
        secondary: '#5c6bc0',
        accent: '#ff6f00',
        accentLight: '#ffeb3b',
    },
    darkPurple: {
        name: 'Dark Purple',
        primary: '#4a148c',
        secondary: '#7b1fa2',
        accent: '#ff6f00',
        accentLight: '#ffeb3b',
    },
    forestGreen: {
        name: 'Forest Green',
        primary: '#1b5e20',
        secondary: '#388e3c',
        accent: '#ffa726',
        accentLight: '#ffeb3b',
    },
    sunsetOrange: {
        name: 'Sunset Orange',
        primary: '#d84315',      // Softer burnt orange (was #bf360c - too red)
        secondary: '#ff8a65',    // Warm coral (was #d84315 - too harsh)
        accent: '#ffa726',       // Soft orange (was #ffeb3b - too yellow)
        accentLight: '#ffcc80',  // Peachy (was #ffd54f)
    },
    highContrast: {
        name: 'High Contrast',
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: '#FFFF00',
        accentLight: '#00FF00',
    },
};

export const themeKeys = Object.keys(themes);
