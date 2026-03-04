'use client';

import { LEVELS } from '@/lib/levels';
import { Lightbulb, RotateCcw, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function LevelHeader({ level, attempts, onReset }) {
    const [showHint, setShowHint] = useState(false);
    const levelData = LEVELS.find(l => l.id === level);
    if (!levelData) return null;

    return (
        <div className="border-b border-vault-border bg-vault-surface/60 backdrop-blur-sm">
            <div className="px-4 py-3 flex items-center justify-between">
                {/* Left: Level info */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-2 h-2 rounded-full animate-pulse-glow"
                        style={{ backgroundColor: levelData.color }}
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
                            Defense: {levelData.defense}
                        </p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Attempts counter */}
                    <span className="text-vault-text-dim/60 text-xs font-mono">
                        {attempts} attempt{attempts !== 1 ? 's' : ''}
                    </span>

                    {/* Hint toggle */}
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className={`p-1.5 rounded-md transition-all ${showHint
                                ? 'bg-vault-warning/10 text-vault-warning'
                                : 'text-vault-text-dim/40 hover:text-vault-warning hover:bg-vault-warning/5'
                            }`}
                        title="Show hint"
                    >
                        <Lightbulb className="w-4 h-4" />
                    </button>

                    {/* Reset level */}
                    <button
                        onClick={onReset}
                        className="p-1.5 rounded-md text-vault-text-dim/40 hover:text-vault-danger hover:bg-vault-danger/5 transition-all"
                        title="Reset chat"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Hint drawer */}
            {showHint && (
                <div className="px-4 pb-3 animate-fade-in">
                    <div className="p-3 rounded-lg bg-vault-warning/5 border border-vault-warning/20">
                        <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-vault-warning shrink-0 mt-0.5" />
                            <div>
                                <span className="text-vault-warning text-xs font-mono font-bold uppercase">Hint</span>
                                <p className="text-vault-text-dim text-xs font-mono mt-1">
                                    {levelData.hint}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Level description */}
            <div className="px-4 pb-3">
                <p className="text-vault-text-dim/60 text-xs font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3" />
                    {levelData.description}
                </p>
            </div>
        </div>
    );
}
