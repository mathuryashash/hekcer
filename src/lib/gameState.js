const STORAGE_KEY = 'the-vault-game-state';

const DEFAULT_STATE = {
    currentLevel: 1,
    completedLevels: [],
    messageHistory: {},
    totalAttempts: 0,
    levelAttempts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    startTime: null,
    levelStartTimes: {},
};

/**
 * Generate a simple checksum for state integrity
 * @param {Object} state - Game state
 * @returns {string} Checksum string
 */
function generateChecksum(state) {
    const { currentLevel, completedLevels, totalAttempts } = state;
    const str = `${currentLevel}-${completedLevels.join(',')}-${totalAttempts}`;
    
    // Very simple rolling hash for the sake of the 'hacker' theme
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
}

/**
 * Load game state from localStorage with integrity check
 * @returns {Object} Game state
 */
export function loadGameState() {
    if (typeof window === 'undefined') return DEFAULT_STATE;

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const state = { ...DEFAULT_STATE, ...parsed };
            
            // Basic integrity check
            if (state.checksum && state.checksum !== generateChecksum(state)) {
                console.warn('Game state integrity compromised. Resetting state.');
                return { ...DEFAULT_STATE, startTime: Date.now() };
            }
            
            return state;
        }
    } catch (e) {
        console.warn('Failed to load game state:', e);
    }

    return { ...DEFAULT_STATE, startTime: Date.now() };
}

/**
 * Save game state to localStorage with checksum
 * @param {Object} state - Game state to save
 */
export function saveGameState(state) {
    if (typeof window === 'undefined') return;

    try {
        const stateToSave = { ...state };
        delete stateToSave.checksum;
        stateToSave.checksum = generateChecksum(stateToSave);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
        console.warn('Failed to save game state:', e);
    }
}

/**
 * Mark a level as completed and advance
 * @param {Object} state - Current game state
 * @param {number} level - Level that was completed
 * @returns {Object} Updated game state
 */
export function completeLevel(state, level) {
    const newState = {
        ...state,
        completedLevels: [...new Set([...state.completedLevels, level])],
        currentLevel: Math.min(level + 1, 5),
    };
    saveGameState(newState);
    return newState;
}

/**
 * Add a message to the history for a specific level
 * @param {Object} state - Current game state
 * @param {number} level - Level number
 * @param {Object} message - Message object { role, content, timestamp }
 * @returns {Object} Updated game state
 */
export function addMessage(state, level, message) {
    const levelHistory = state.messageHistory[level] || [];
    const newState = {
        ...state,
        messageHistory: {
            ...state.messageHistory,
            [level]: [...levelHistory, { ...message, timestamp: Date.now() }],
        },
        totalAttempts: message.role === 'user' ? state.totalAttempts + 1 : state.totalAttempts,
        levelAttempts: message.role === 'user'
            ? { ...state.levelAttempts, [level]: (state.levelAttempts[level] || 0) + 1 }
            : state.levelAttempts,
    };
    saveGameState(newState);
    return newState;
}

/**
 * Reset all game progress
 * @returns {Object} Fresh game state
 */
export function resetGameState() {
    const freshState = { ...DEFAULT_STATE, startTime: Date.now() };
    saveGameState(freshState);
    return freshState;
}
