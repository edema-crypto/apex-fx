import React, { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { User, Image as ImageIcon, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim());
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatarData = user?.avatar ?? null;
      if (file) {
        avatarData = await toBase64(file);
      }

      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ');

      updateUser({ firstName: firstName || user?.firstName, lastName: lastName || user?.lastName, avatar: avatarData ?? undefined });
      localStorage.setItem('apexfx_onboarded', 'true');
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-8" />
          <h1 className="text-xl font-semibold text-white">Complete your profile</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Your name</label>
            <div className="relative">
              <Input icon={User} placeholder="First and last name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Profile picture</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} className="text-slate-300" />
            </div>
          </div>

          <Button onClick={handleSave} icon={Save} loading={saving} className="w-full">Save Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


