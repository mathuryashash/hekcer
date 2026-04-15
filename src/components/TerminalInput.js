'use client';

import React from 'react';
import { Loader2, Send } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const handleInputChange = useCallback((e) => {
        setInput(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e) => {
        setPasswordInput(e.target.value);
    }, []);

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

    const handlePasswordSubmit = useCallback((e) => {
        e.preventDefault();
        if (passwordInput.trim() && !disabled && onPasswordSubmit) {
            onPasswordSubmit(passwordInput.trim());
            setPasswordInput('');
        }
    }, [passwordInput, disabled, onPasswordSubmit]);

    const charCount = useMemo(() => input.length, [input]);
    const isOverLimit = useMemo(() => charCount > charLimit, [charCount, charLimit]);
    const canSubmit = useMemo(() => !disabled && input.trim() && !isOverLimit, [disabled, input, isOverLimit]);
    const canPasswordSubmit = useMemo(() => !disabled && passwordInput.trim(), [disabled, passwordInput]);

    const handleAutoResize = useCallback((e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    }, []);

    const handleTextareaChange = useCallback((e) => {
        handleInputChange(e);
        handleAutoResize(e);
    }, [handleInputChange, handleAutoResize]);

    const levelLabel = useMemo(() => `vault@mvl${level}`, [level]);

    const colorClass = useMemo(() => {
        if (isOverLimit) return 'text-vault-danger';
        if (charCount > charLimit * 0.8) return 'text-vault-warning';
        return 'text-vault-text-dim/40';
    }, [isOverLimit, charCount, charLimit]);

    return (
        <div className={`
      border-t border-vault-border bg-vault-surface/80 backdrop-blur-sm
      transition-all duration-300
      ${isFocused ? 'border-vault-accent/50' : ''}
    `} role="form" aria-label="Command input">
            <form ref={formRef} onSubmit={handleSubmit} className="p-4" aria-label="Send message form">
                <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2 pt-1 shrink-0" aria-hidden="true">
                        <span className="text-vault-accent font-mono text-sm font-bold">
                            {levelLabel}
                        </span>
                        <span className="text-vault-text-dim font-mono text-sm">{'>'}</span>
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={handleTextareaChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
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
                            onInput={handleAutoResize}
                            aria-label="Prompt injection input"
                            aria-describedby="char-count"
                            aria-invalid={isOverLimit}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!canSubmit}
                        className={`
              shrink-0 p-2 rounded-lg transition-all duration-200
              ${!canSubmit
                                ? 'text-vault-text-dim/30 cursor-not-allowed'
                                : 'text-vault-accent hover:bg-vault-accent/10 active:scale-95 cursor-pointer'
                            }
            `}
                        aria-label={disabled ? 'Sending message' : 'Send message'}
                    >
                        {disabled ? (
                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                        ) : (
                            <Send className="w-5 h-5" aria-hidden="true" />
                        )}
                    </button>
                </div>

                <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-vault-text-dim/40 text-xs font-mono" id="char-count">
                        shift+enter for new line
                    </span>
                    <span className={`text-xs font-mono ${colorClass}`} aria-live={isOverLimit ? 'assertive' : 'polite'} aria-atomic="true">
                        {charCount}/{charLimit}
                    </span>
                </div>
            </form>

            <div className="p-3 border-t border-vault-border/50 bg-vault-surface/50" role="form" aria-label="Submit key form">
                <form
                    onSubmit={handlePasswordSubmit}
                    className="flex items-center gap-3"
                    aria-label="Submit extracted key"
                >
                    <span className="text-vault-text-dim font-mono text-xs uppercase tracking-wider shrink-0" id="key-label">
                        Submit Key:
                    </span>
                    <input
                        type="text"
                        value={passwordInput}
                        onChange={handlePasswordChange}
                        disabled={disabled}
                        placeholder="Extracted the key? Enter it here..."
                        className="flex-1 bg-transparent border-b border-vault-border focus:border-vault-accent outline-none font-mono text-sm py-1 shadow-none focus:ring-0 text-vault-text transition-colors"
                        aria-labelledby="key-label"
                    />
                    <button
                        type="submit"
                        disabled={!canPasswordSubmit}
                        className={`text-xs font-mono px-3 py-1.5 rounded transition-colors ${!canPasswordSubmit
                            ? 'bg-vault-surface text-vault-text-dim cursor-not-allowed'
                            : 'bg-vault-accent text-vault-bg hover:bg-vault-accent/90 cursor-pointer text-black font-bold'
                            }`}
                        aria-label="Verify extracted key"
                    >
                        VERIFY
                    </button>
                </form>
            </div>
        </div>
    );
}
