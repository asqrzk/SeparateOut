
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface ProfileEditorProps {
  onSave: (p: UserProfile) => void;
  initial: UserProfile | null;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ onSave, initial }) => {
  const [username, setUsername] = useState(initial?.username || '');
  const [profilePic, setProfilePic] = useState(initial?.profilePic || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePic(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-3xl p-8 space-y-8 shadow-2xl relative">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#32cd32] uppercase">Identity</h2>
          <p className="text-gray-400 text-sm mt-2">Personalize your carousel branding.</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#32cd32] transition-all">
            {profilePic ? <img src={profilePic} alt="profile" className="w-full h-full object-cover" /> : <span className="text-gray-500">Avatar</span>}
          </div>
          <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handleFile} />
        </div>
        <div className="space-y-4">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username / Page Name"
            className="w-full bg-black border border-gray-800 rounded-2xl px-5 py-4 text-white font-bold"
          />
          <button disabled={!username || !profilePic} onClick={() => onSave({ username, profilePic })} className="w-full py-5 bg-[#32cd32] text-black font-black rounded-2xl uppercase tracking-tighter shadow-lg shadow-[#32cd32]/10">
            Confirm Identity
          </button>
        </div>
      </div>
    </div>
  );
};
