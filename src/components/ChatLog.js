'use client';

import { AlertTriangle, Bot, CheckCircle2, Terminal } from 'lucide-react';
import { useEffect, useRef } from 'react';

function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isSuccess = message.success === true;
    const isBlocked = message.content?.startsWith('[SECURITY SYSTEM]') ||
        message.content?.startsWith('[JUDGE AI]') ||
        message.content?.startsWith('[RATE LIMIT]') ||
        message.content?.startsWith('[ERROR]') ||
        message.content?.startsWith('[TIMEOUT]') ||
        message.content?.startsWith('[CONNECTION ERROR]');

    const getIcon = () => {
        if (isUser) return <Terminal className="w-4 h-4" />;
        if (isSuccess) return <CheckCircle2 className="w-4 h-4" />;
        if (isBlocked) return <AlertTriangle className="w-4 h-4" />;
        return <Bot className="w-4 h-4" />;
    };

    const getAccentColor = () => {
        if (isUser) return 'text-vault-cyan border-vault-cyan/20 bg-vault-cyan/5';
        if (isSuccess) return 'text-vault-accent border-vault-accent/30 bg-vault-accent/5';
        if (isBlocked) return 'text-vault-danger border-vault-danger/20 bg-vault-danger/5';
        if (isSystem) return 'text-vault-warning border-vault-warning/20 bg-vault-warning/5';
        return 'text-vault-text border-vault-border bg-vault-surface/50';
    };

    const getLabelColor = () => {
        if (isUser) return 'text-vault-cyan';
        if (isSuccess) return 'text-vault-accent';
        if (isBlocked) return 'text-vault-danger';
        if (isSystem) return 'text-vault-warning';
        return 'text-vault-text-dim';
    };

    const getLabel = () => {
        if (isUser) return 'YOU';
        if (isSystem) return 'SYSTEM';
        return 'VAULT AI';
    };

    return (
        <div className={`message-enter p-4 rounded-lg border ${getAccentColor()} ${isSuccess ? 'success-flash' : ''
            } ${isBlocked ? 'error-shake' : ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <span className={getLabelColor()}>{getIcon()}</span>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${getLabelColor()}`}>
                    {getLabel()}
                </span>
                {message.timestamp && (
                    <span className="text-vault-text-dim/30 text-xs font-mono ml-auto">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                )}
            </div>
            <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap pl-6">
                {message.content}
            </div>
            {isSuccess && (
                <div className="mt-3 pl-6 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-vault-accent" />
                    <span className="text-vault-accent text-sm font-bold font-mono glow-text">
                        ✓ VAULT BREACHED – KEY EXTRACTED!
                    </span>
                </div>
            )}
        </div>
    );
}

export default function ChatLog({ messages }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-md">
                    <div className="w-16 h-16 mx-auto rounded-full border border-vault-border flex items-center justify-center">
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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
