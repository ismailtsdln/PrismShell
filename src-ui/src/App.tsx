import { useState, useEffect } from 'react';
import { TerminalComponent } from './components/TerminalComponent';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ProfileModal } from './components/ProfileModal';
import { getProfiles, createProfile, connectSsh, Profile } from './api/tauri';

function ShellLayout() {
  const [activeTab, setActiveTab] = useState('Welcome');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Load profiles on startup
    getProfiles().then((p: Profile[]) => setProfiles(p)).catch(console.error);
  }, []);

  const handleCreateProfile = async (p: Profile) => {
    try {
      await createProfile(p);
      setProfiles((prev: Profile[]) => [...prev, p]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = async (p: Profile) => {
    setActiveTab(p.name);
    try {
        await connectSsh(p.host, p.port, p.username);
        // Note: Actual stdout would need a sophisticated event listener which we haven't mocked fully
    } catch (e) {
        console.error("Connection failed", e);
    }
  };

  return (
    <div className="flex h-screen w-full bg-prism-bg text-prism-fg font-sans overflow-hidden" style={{ backgroundColor: theme.colors.background, color: theme.colors.foreground }}>
      <ProfileModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleCreateProfile} />
      
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 border-r border-white/10" style={{ backgroundColor: '#181825' }}>
        <div className="w-10 h-10 bg-prism-accent rounded-xl mb-4 flex items-center justify-center font-bold text-gray-900 cursor-pointer" onClick={() => setShowModal(true)}>
          +
        </div>
        <div className="flex-1 w-full space-y-2 px-2 overflow-y-auto">
            {profiles.map(p => (
                <div key={p.id} 
                    className="w-full aspect-square rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors flex items-center justify-center text-xs font-mono border border-white/5" 
                    title={p.name}
                    onClick={() => handleConnect(p)}
                >
                    {p.name.substring(0, 2).toUpperCase()}
                </div>
            ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Tabs Bar */}
        <header className="h-10 bg-prism-secondary flex items-end px-2 space-x-1 select-none app-drag-region" style={{ backgroundColor: theme.colors.background }}>
          <div className="px-4 py-2 rounded-t-lg text-sm border-t border-x border-white/10 min-w-[120px] relative top-[1px]" style={{ backgroundColor: theme.colors.background }}>
            {activeTab}
          </div>
        </header>

        {/* Terminal Area */}
        <div className="flex-1 overflow-hidden relative pl-2 pt-2">
            <TerminalComponent 
                onInput={(data) => console.log('Input:', data)} 
                theme={theme.colors}
            />
        </div>
      </main>
    </div>
  );
}

function App() {
    return (
        <ThemeProvider>
            <ShellLayout />
        </ThemeProvider>
    )
}

export default App;
