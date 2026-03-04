import './globals.css';

export const metadata = {
    title: 'The Vault – Prompt Injection Learning Lab',
    description: 'A gamified educational platform where you learn to bypass LLM security constraints through 5 levels of increasing complexity.',
    keywords: ['prompt injection', 'AI security', 'CTF', 'LLM', 'jailbreaking', 'cybersecurity'],
    authors: [{ name: 'The Vault Team' }],
    openGraph: {
        title: 'The Vault – Prompt Injection Learning Lab',
        description: 'Master prompt injection techniques through 5 challenging levels.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className="crt-effect" suppressHydrationWarning>
                <div className="scan-line" />
                <div className="noise-overlay" />
                {children}
            </body>
        </html>
    );
}
