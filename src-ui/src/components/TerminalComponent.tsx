import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { listen } from '@tauri-apps/api/event';
import { sendInput } from '../api/tauri';
import 'xterm/css/xterm.css';

interface TerminalProps {
    onInput?: (data: string) => void;
    theme?: any; 
}

interface SshDataEvent {
    data: string;
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

        // Listen for user input and send to backend
        term.onData((data) => {
           sendInput(data).catch(console.error);
           onInput?.(data);
        });

        xtermRef.current = term;

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Listen for backend SSH data
        const unlistenPromise = listen<SshDataEvent>('ssh-data', (event) => {
            term.write(event.payload.data);
        });

        term.writeln('\x1b[32mWelcome to PrismShell\x1b[0m');
        term.writeln('Select a profile to connect...');

        return () => {
            unlistenPromise.then(unlisten => unlisten());
            term.dispose();
            window.removeEventListener('resize', handleResize);
        }
    }, [theme]); // Recreating on theme change is expensive but fine for MVP

    return <div className="w-full h-full" ref={terminRef} />;
}
