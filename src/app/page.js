'use client';

import ChatLog from '@/components/ChatLog';
import LevelHeader from '@/components/LevelHeader';
import LevelSelector from '@/components/LevelSelector';
import TerminalInput from '@/components/TerminalInput';
import { sendHackAttempt, submitPassword } from '@/lib/api';
import { addMessage, completeLevel, loadGameState, resetGameState, saveGameState } from '@/lib/gameState';
import { Menu, RotateCcw, Skull, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function VaultPage() {
    const [gameState, setGameState] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Load state from localStorage on mount
    useEffect(() => {
        setGameState(loadGameState());
    }, []);

    const currentMessages = gameState?.messageHistory?.[gameState?.currentLevel] || [];
    const currentAttempts = gameState?.levelAttempts?.[gameState?.currentLevel] || 0;

    const handlePasswordSubmit = useCallback(async (password) => {
        if (!gameState || isLoading) return;
        setIsLoading(true);

        // Add user message indicating password attempt
        const userMsg = { role: 'user', content: `[SUBMITTING EXTRACTED KEY]: ${password}` };
        let newState = addMessage(gameState, gameState.currentLevel, userMsg);
        setGameState({ ...newState });

        try {
            // Call the password API
            const result = await submitPassword(password, gameState.currentLevel);

            // Add system response
            const aiMsg = {
                role: 'system',
                content: result.message,
                success: result.success,
            };
            newState = addMessage(newState, gameState.currentLevel, aiMsg);

            // Check if level was completed
            if (result.success && result.level_completed) {
                newState = completeLevel(newState, gameState.currentLevel);

                // Add system congratulation message
                const congratsMsg = {
                    role: 'system',
                    content: gameState.currentLevel < 5
                        ? `🎉 Level ${gameState.currentLevel} breached! Advancing to Level ${gameState.currentLevel + 1}...`
                        : `🏆 CONGRATULATIONS! You've breached ALL 5 VAULTS! You are a Master Hacker!`,
                };
                newState = addMessage(newState, gameState.currentLevel, congratsMsg);
            }

            setGameState({ ...newState });
        } catch (error) {
            const errorMsg = {
                role: 'system',
                content: '[SYSTEM ERROR]: An unexpected error occurred. Please try again.',
            };
            newState = addMessage(newState, gameState.currentLevel, errorMsg);
            setGameState({ ...newState });
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading]);

    const handleSubmit = useCallback(async (input) => {
        if (!gameState || isLoading) return;
        setIsLoading(true);

        // Add user message
        const userMsg = { role: 'user', content: input };
        let newState = addMessage(gameState, gameState.currentLevel, userMsg);
        setGameState({ ...newState });

        try {
            // Call the API
            const result = await sendHackAttempt(input, gameState.currentLevel);

            // Add AI response
            const aiMsg = {
                role: result.success ? 'system' : 'assistant',
                content: result.message,
                success: result.success,
            };
            newState = addMessage(newState, gameState.currentLevel, aiMsg);

            // Check if level was completed
            if (result.success && result.level_completed) {
                newState = completeLevel(newState, gameState.currentLevel);

                // Add system congratulation message
                const congratsMsg = {
                    role: 'system',
                    content: gameState.currentLevel < 5
                        ? `🎉 Level ${gameState.currentLevel} breached! Advancing to Level ${gameState.currentLevel + 1}...`
                        : `🏆 CONGRATULATIONS! You've breached ALL 5 VAULTS! You are a Master Hacker!`,
                };
                newState = addMessage(newState, gameState.currentLevel, congratsMsg);
            }

            setGameState({ ...newState });
        } catch (error) {
            const errorMsg = {
                role: 'system',
                content: '[SYSTEM ERROR]: An unexpected error occurred. Please try again.',
            };
            newState = addMessage(newState, gameState.currentLevel, errorMsg);
            setGameState({ ...newState });
        } finally {
            setIsLoading(false);
        }
    }, [gameState, isLoading]);

    const handleSelectLevel = useCallback((levelId) => {
        if (!gameState) return;
        const newState = { ...gameState, currentLevel: levelId };
        saveGameState(newState);
        setGameState(newState);
        setSidebarOpen(false);
    }, [gameState]);

    const handleResetChat = useCallback(() => {
        if (!gameState) return;
        const newState = {
            ...gameState,
            messageHistory: {
                ...gameState.messageHistory,
                [gameState.currentLevel]: [],
            },
            levelAttempts: {
                ...gameState.levelAttempts,
                [gameState.currentLevel]: 0,
            },
        };
        saveGameState(newState);
        setGameState(newState);
    }, [gameState]);

    const handleResetAll = useCallback(() => {
        if (confirm('Reset ALL progress? This cannot be undone.')) {
            setGameState(resetGameState());
        }
    }, []);

    // Loading skeleton
    if (!gameState) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <Skull className="w-12 h-12 text-vault-accent mx-auto animate-pulse" />
                    <p className="text-vault-text-dim font-mono text-sm">Initializing vault systems...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative z-10">
            {/* Top Bar */}
            <header className="h-14 border-b border-vault-border bg-vault-surface/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                    {/* Mobile sidebar toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-1.5 rounded-md text-vault-text-dim hover:text-vault-accent hover:bg-vault-accent/5 transition-all"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Skull className="w-5 h-5 text-vault-accent" />
                        <h1 className="text-sm font-mono font-bold tracking-wider">
                            <span className="text-vault-accent glow-text">THE</span>
                            <span className="text-vault-text ml-1">VAULT</span>
                        </h1>
                    </div>

                    {/* Version tag */}
                    <span className="hidden sm:inline text-[10px] font-mono text-vault-text-dim/40 px-1.5 py-0.5 rounded border border-vault-border/50">
                        v2.0
                    </span>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleResetAll}
                        className="p-1.5 rounded-md text-vault-text-dim/40 hover:text-vault-danger hover:bg-vault-danger/5 transition-all"
                        title="Reset all progress"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className={`
          w-64 border-r border-vault-border bg-vault-bg/95 backdrop-blur-sm
          overflow-y-auto p-3 shrink-0
          lg:relative lg:translate-x-0 lg:block
          fixed top-14 bottom-0 left-0 z-50 transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
                    <LevelSelector
                        currentLevel={gameState.currentLevel}
                        completedLevels={gameState.completedLevels}
                        onSelectLevel={handleSelectLevel}
                    />
                </aside>

                {/* Overlay for mobile sidebar */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Chat area */}
                <main className="flex-1 flex flex-col min-w-0">
                    <LevelHeader
                        level={gameState.currentLevel}
                        attempts={currentAttempts}
                        onReset={handleResetChat}
                    />
                    <ChatLog messages={currentMessages} />
                    <TerminalInput
                        onSubmit={handleSubmit}
                        onPasswordSubmit={handlePasswordSubmit}
                        disabled={isLoading}
                        level={gameState.currentLevel}
                    />
                </main>
            </div>
        </div>
    );
}
