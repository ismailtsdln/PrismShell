import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
    onInput?: (data: string) => void;
    theme?: any; // Pass theme object
}

export function TerminalComponent({ onInput, theme }: TerminalProps) {
    const terminRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontFamily: '"JetBrains Mono", Consolas, monospace',
            fontSize: 14,
            theme: theme || {
                background: '#1e1e2e',
                foreground: '#cdd6f4',
            }
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminRef.current);
        fitAddon.fit();

        term.onData((data) => {
            onInput?.(data);
        });

        xtermRef.current = term;

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Welcome message
        term.writeln('\x1b[32mWelcome to PrismShell\x1b[0m');
        term.writeln('Initialize connection to start...');

        return () => {
            term.dispose();
            window.removeEventListener('resize', handleResize);
        }
    }, [theme]);

    return <div className="w-full h-full" ref={terminRef} />;
}
