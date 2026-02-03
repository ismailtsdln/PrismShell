import { useState } from 'react';
import { Profile } from '../api/tauri';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (p: Profile) => void;
}

export function ProfileModal({ isOpen, onClose, onSave }: ProfileModalProps) {
    const [name, setName] = useState('');
    const [host, setHost] = useState('');
    const [user, setUser] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: crypto.randomUUID(),
            name,
            host,
            port: 22,
            username: user
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e2e] p-6 rounded-lg border border-white/10 w-96 shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-white">New Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Profile Name</label>
                        <input className="w-full bg-[#313244] text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Host</label>
                        <input className="w-full bg-[#313244] text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            value={host} onChange={e => setHost(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input className="w-full bg-[#313244] text-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                            value={user} onChange={e => setUser(e.target.value)} required />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded hover:bg-white/5 text-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
