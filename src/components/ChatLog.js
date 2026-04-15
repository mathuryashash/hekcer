'use client';

import React from 'react';
import { AlertTriangle, Bot, CheckCircle2, Terminal } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';

function MessageBubble({ message, index, total }) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isSuccess = message.success === true;
    const isBlocked = message.content?.startsWith('[SECURITY SYSTEM]') ||
        message.content?.startsWith('[JUDGE AI]') ||
        message.content?.startsWith('[RATE LIMIT]') ||
        message.content?.startsWith('[ERROR]') ||
        message.content?.startsWith('[TIMEOUT]') ||
        message.content?.startsWith('[CONNECTION ERROR]');

    const messageTypeLabel = isUser ? 'Your message' : isSystem ? 'System message' : 'Vault AI response';
    const statusLabel = isSuccess ? 'Success' : isBlocked ? 'Blocked' : '';

    const icon = useMemo(() => {
        if (isUser) return <Terminal className="w-4 h-4" aria-hidden="true" />;
        if (isSuccess) return <CheckCircle2 className="w-4 h-4" aria-hidden="true" />;
        if (isBlocked) return <AlertTriangle className="w-4 h-4" aria-hidden="true" />;
        return <Bot className="w-4 h-4" aria-hidden="true" />;
    }, [isUser, isSuccess, isBlocked]);

    const accentColor = useMemo(() => {
        if (isUser) return 'text-vault-cyan border-vault-cyan/20 bg-vault-cyan/5';
        if (isSuccess) return 'text-vault-accent border-vault-accent/30 bg-vault-accent/5';
        if (isBlocked) return 'text-vault-danger border-vault-danger/20 bg-vault-danger/5';
        if (isSystem) return 'text-vault-warning border-vault-warning/20 bg-vault-warning/5';
        return 'text-vault-text border-vault-border bg-vault-surface/50';
    }, [isUser, isSuccess, isBlocked, isSystem]);

    const labelColor = useMemo(() => {
        if (isUser) return 'text-vault-cyan';
        if (isSuccess) return 'text-vault-accent';
        if (isBlocked) return 'text-vault-danger';
        if (isSystem) return 'text-vault-warning';
        return 'text-vault-text-dim';
    }, [isUser, isSuccess, isBlocked, isSystem]);

    const label = useMemo(() => {
        if (isUser) return 'YOU';
        if (isSystem) return 'SYSTEM';
        return 'VAULT AI';
    }, [isUser, isSystem]);

    const timestamp = useMemo(() => {
        return message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : null;
    }, [message.timestamp]);

    return (
        <article 
            className={`message-enter p-4 rounded-lg border ${accentColor} ${isSuccess ? 'success-flash' : ''
                } ${isBlocked ? 'error-shake' : ''}`}
            role={isUser ? 'textbox' : 'article'}
            aria-label={`${messageTypeLabel}${statusLabel ? ` - ${statusLabel}` : ''}`}
            aria-setsize={total}
            aria-posinset={index + 1}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className={labelColor} aria-hidden="true">{icon}</span>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${labelColor}`}>
                    {label}
                </span>
                {timestamp && (
                    <span className="text-vault-text-dim/30 text-xs font-mono ml-auto" aria-label={`Sent at ${timestamp}`}>
                        {timestamp}
                    </span>
                )}
            </div>
            <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {message.content}
            </div>
            {isSuccess && (
                <div className="mt-3 pl-6 flex items-center gap-2" role="status" aria-live="polite">
                    <CheckCircle2 className="w-4 h-4 text-vault-accent" aria-hidden="true" />
                    <span className="text-vault-accent text-sm font-bold font-mono glow-text">
                        ✓ VAULT BREACHED – KEY EXTRACTED!
                    </span>
                </div>
            )}
        </article>
    );
}

export default function ChatLog({ messages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8" role="status" aria-live="polite">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full border border-vault-border flex items-center justify-center" aria-hidden="true">
                        <Terminal className="w-8 h-8 text-vault-accent/50" />
                    </div>
                    <h3 className="text-vault-text-dim font-mono text-lg">
                        Terminal Ready
                    </h3>
                    <p className="text-vault-text-dim/50 text-sm font-mono">
                        Enter a prompt injection below to attempt breaching the vault.
                        The AI will respond, and the system will check if you extracted the key.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3" role="log" aria-label="Chat messages" aria-live="polite" aria-atomic="false">
            {messages.map((msg, index) => (
                <MessageBubble 
                    key={msg.timestamp || msg.id || Math.random()} 
                    message={msg}
                    index={index}
                    total={messages.length}
                />
            ))}
            <div ref={bottomRef} aria-hidden="true" />
        </div>
    );
}
