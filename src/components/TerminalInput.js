'use client';

import { Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function TerminalInput({ onSubmit, onPasswordSubmit, disabled, level, charLimit = 2000 }) {
    const [input, setInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled, level]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || disabled) return;
        onSubmit(trimmed);
        setInput('');
    }, [input, disabled, onSubmit]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    const charCount = input.length;
    const isOverLimit = charCount > charLimit;

    return (
        <div className={`
      border-t border-vault-border bg-vault-surface/80 backdrop-blur-sm
      transition-all duration-300
      ${isFocused ? 'border-vault-accent/50' : ''}
    `}>
            <form ref={formRef} onSubmit={handleSubmit} className="p-4">
                {/* Prompt indicator */}
                <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 pt-1 shrink-0">
                        <span className="text-vault-accent font-mono text-sm font-bold">
                            vault@lvl{level}
                        </span>
                        <span className="text-vault-text-dim font-mono text-sm">{'>'}</span>
                    </div>

                    {/* Input area */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={handleKeyDown}
                            disabled={disabled}
                            placeholder={disabled ? 'Processing...' : 'Enter your prompt injection attempt...'}
                            className="terminal-input resize-none w-full min-h-[24px] max-h-[120px] leading-relaxed"
                            rows={1}
                            maxLength={charLimit}
                            style={{
                                height: 'auto',
                                overflow: 'hidden',
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={disabled || !input.trim() || isOverLimit}
                        className={`
              shrink-0 p-2 rounded-lg transition-all duration-200
              ${disabled || !input.trim() || isOverLimit
                                ? 'text-vault-text-dim/30 cursor-not-allowed'
                                : 'text-vault-accent hover:bg-vault-accent/10 active:scale-95 cursor-pointer'
                            }
            `}
                    >
                        {disabled ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Character counter */}
                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-vault-text-dim/40 text-xs font-mono">
                        shift+enter for new line
                    </span>
                    <span className={`text-xs font-mono ${isOverLimit ? 'text-vault-danger' :
                        charCount > charLimit * 0.8 ? 'text-vault-warning' :
                            'text-vault-text-dim/40'
                        }`}>
                        {charCount}/{charLimit}
                    </span>
                </div>
            </form>

            {/* Password Verification UI */}
            <div className="p-3 border-t border-vault-border/50 bg-vault-surface/50">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (passwordInput.trim() && !disabled && onPasswordSubmit) {
                            onPasswordSubmit(passwordInput.trim());
                            setPasswordInput('');
                        }
                    }}
                    className="flex items-center gap-3"
                >
                    <span className="text-vault-text-dim font-mono text-xs uppercase tracking-wider shrink-0">
                        Submit Key:
                    </span>
                    <input
                        type="text"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        disabled={disabled}
                        placeholder="Extracted the key? Enter it here..."
                        className="flex-1 bg-transparent border-b border-vault-border focus:border-vault-accent outline-none font-mono text-sm py-1 shadow-none focus:ring-0 text-vault-text transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={disabled || !passwordInput.trim()}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${disabled || !passwordInput.trim()
                            ? 'bg-vault-surface text-vault-text-dim cursor-not-allowed'
                            : 'bg-vault-accent text-vault-bg hover:bg-vault-accent/90 cursor-pointer text-black font-bold'
                            }`}
                    >
                        VERIFY
                    </button>
                </form>
            </div>
        </div>
    );
}
