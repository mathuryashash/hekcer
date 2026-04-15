'use client';

import React from 'react';
import { LEVELS } from '@/lib/levels';
import { Lightbulb, RotateCcw, ShieldAlert } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export default function LevelHeader({ level, attempts, onReset }) {
    const [showHint, setShowHint] = useState(false);
    const levelData = useMemo(() => LEVELS.find(l => l.id === level), [level]);
    if (!levelData) return null;

    const handleHintToggle = useCallback(() => {
        setShowHint(prev => !prev);
    }, []);

    const handleReset = useCallback(() => {
        onReset?.();
    }, [onReset]);

    const hintContent = useMemo(() => levelData.hint, [levelData.hint]);
    const description = useMemo(() => levelData.description, [levelData.description]);
    const defense = useMemo(() => levelData.defense, [levelData.defense]);

    return (
        <div className="border-b border-vault-border bg-vault-surface/60 backdrop-blur-sm" role="banner">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-2 h-2 rounded-full animate-pulse-glow"
                        style={{ backgroundColor: levelData.color }}
                        role="img"
                        aria-label={`Active level indicator: ${levelData.name}`}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-mono font-bold text-vault-text">
                                Level {level}: {levelData.name}
                            </h2>
                            <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                                style={{
                                    color: levelData.color,
                                    backgroundColor: `${levelData.color}15`,
                                    border: `1px solid ${levelData.color}30`,
                                }}
                            >
                                {levelData.difficulty}
                            </span>
                        </div>
                        <p className="text-vault-text-dim text-xs font-mono mt-0.5">
                            Defense: {defense}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2" role="group" aria-label="Level actions">
                    <span className="text-vault-text-dim/60 text-xs font-mono" aria-live="polite">
                        {attempts} attempt{attempts !== 1 ? 's' : ''}
                    </span>

                    <button
                        onClick={handleHintToggle}
                        className={`p-1.5 rounded-md transition-all ${showHint
                                ? 'bg-vault-warning/10 text-vault-warning'
                                : 'text-vault-text-dim/40 hover:text-vault-warning hover:bg-vault-warning/5'
                            }`}
                        title="Show hint"
                        aria-label={showHint ? 'Hide hint' : 'Show hint'}
                        aria-pressed={showHint}
                    >
                        <Lightbulb className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                        onClick={handleReset}
                        className="p-1.5 rounded-md text-vault-text-dim/40 hover:text-vault-danger hover:bg-vault-danger/5 transition-all"
                        title="Reset chat"
                        aria-label="Reset chat for this level"
                    >
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {showHint && (
                <div className="px-4 pb-3 animate-fade-in" role="region" aria-label="Hint" aria-live={showHint ? 'polite' : 'off'}>
                    <div className="p-3 rounded-lg bg-vault-warning/5 border border-vault-warning/20">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-vault-warning shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                                <span className="text-vault-warning text-xs font-mono font-bold uppercase">Hint</span>
                                <p className="text-vault-text-dim text-xs font-mono mt-1">
                                    {hintContent}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="px-4 pb-3">
                <p className="text-vault-text-dim/60 text-xs font-mono flex items-center gap-1.5" role="note">
                    <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                    {description}
                </p>
            </div>
        </div>
    );
}
