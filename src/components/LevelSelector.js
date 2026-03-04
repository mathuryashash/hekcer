'use client';

import { LEVELS } from '@/lib/levels';
import {
    Building2,
    CheckCircle2,
    ChevronRight,
    Filter,
    Lock,
    Scale,
    Shield,
    Sparkles,
    UserRound
} from 'lucide-react';

const ICON_MAP = {
    UserRound,
    Shield,
    Filter,
    Scale,
    Building2,
};

export default function LevelSelector({ currentLevel, completedLevels, onSelectLevel }) {
    return (
        <div className="space-y-2">
            <div className="px-2 py-1">
                <h3 className="text-xs font-mono text-vault-text-dim uppercase tracking-widest mb-3">
                    Security Clearance
                </h3>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-vault-border rounded-full overflow-hidden mb-4">
                    <div
                        className="level-progress h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${(completedLevels.length / 5) * 100}%` }}
                    />
                </div>
                <p className="text-xs text-vault-text-dim font-mono mb-4">
                    {completedLevels.length}/5 Levels Breached
                </p>
            </div>

            {LEVELS.map((level) => {
                const isCompleted = completedLevels.includes(level.id);
                const isActive = currentLevel === level.id;
                const isLocked = level.id > Math.max(...completedLevels, 0) + 1;
                const IconComponent = ICON_MAP[level.icon] || Lock;

                return (
                    <button
                        key={level.id}
                        onClick={() => !isLocked && onSelectLevel(level.id)}
                        disabled={isLocked}
                        className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              border group relative overflow-hidden
              ${isActive
                                ? 'border-vault-accent/40 bg-vault-accent/5'
                                : isCompleted
                                    ? 'border-vault-accent/20 bg-vault-surface hover:bg-vault-accent/5'
                                    : isLocked
                                        ? 'border-vault-border/30 bg-vault-surface/30 cursor-not-allowed opacity-50'
                                        : 'border-vault-border bg-vault-surface hover:border-vault-border hover:bg-vault-surface/80'
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            {/* Level icon */}
                            <div className={`
                w-8 h-8 rounded-md flex items-center justify-center shrink-0
                ${isCompleted
                                    ? 'bg-vault-accent/10 text-vault-accent'
                                    : isActive
                                        ? 'bg-vault-warning/10 text-vault-warning'
                                        : isLocked
                                            ? 'bg-vault-border/30 text-vault-text-dim/30'
                                            : 'bg-vault-border/50 text-vault-text-dim'
                                }
              `}>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4" />
                                ) : isLocked ? (
                                    <Lock className="w-4 h-4" />
                                ) : (
                                    <IconComponent className="w-4 h-4" />
                                )}
                            </div>

                            {/* Level info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-mono font-medium truncate ${isActive ? 'text-vault-accent' :
                                            isCompleted ? 'text-vault-accent/80' :
                                                isLocked ? 'text-vault-text-dim/30' :
                                                    'text-vault-text'
                                        }`}>
                                        {level.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span
                                        className="text-[10px] font-mono uppercase tracking-wider"
                                        style={{ color: isLocked ? 'var(--vault-text-dim)' : level.color, opacity: isLocked ? 0.3 : 0.8 }}
                                    >
                                        {level.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow */}
                            {!isLocked && (
                                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-vault-accent translate-x-0' : 'text-vault-text-dim/30 group-hover:translate-x-1'
                                    }`} />
                            )}
                        </div>
                    </button>
                );
            })}

            {/* All completed banner */}
            {completedLevels.length === 5 && (
                <div className="mt-4 p-3 rounded-lg border border-vault-purple/30 bg-vault-purple/5 text-center">
                    <Sparkles className="w-5 h-5 text-vault-purple mx-auto mb-1" />
                    <p className="text-vault-purple text-xs font-mono font-bold">
                        MASTER HACKER
                    </p>
                    <p className="text-vault-text-dim text-[10px] font-mono mt-1">
                        All vaults breached
                    </p>
                </div>
            )}
        </div>
    );
}
