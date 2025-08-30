import React, { useState, useRef } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { 
  User as UserIcon, 
  Image as ImageIcon, 
  Save, 
  Bell, 
  Palette, 
  CreditCard, 
  Settings as SettingsIcon,
  Upload,
  X,
  Camera
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim());
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Trading preferences
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [autoConfirmTrades, setAutoConfirmTrades] = useState(false);
  
  // Theme settings
  const [theme, setTheme] = useState('dark');
  const [compactMode, setCompactMode] = useState(false);

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      if (f.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!f.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      toast.success('Profile picture updated!');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const f = e.dataTransfer.files[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!f.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      toast.success('Profile picture updated!');
    }
  };

  const removeProfilePicture = () => {
    setFile(null);
    setPreview(null);
    toast.success('Profile picture removed!');
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatar = user?.avatar ?? undefined;
      if (file) avatar = await toBase64(file);

      const [first, ...rest] = name.split(' ');
      const last = rest.join(' ');
      updateUser({ firstName: first || user?.firstName, lastName: last || user?.lastName, avatar });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = () => {
    toast.success('Notification preferences saved!');
  };

  const handleTradingPreferencesSave = () => {
    toast.success('Trading preferences saved!');
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Display name</label>
            <Input icon={UserIcon} placeholder="First and last name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-3">Profile Picture</label>
            <div className="flex items-start gap-6">
              {/* Profile Picture Display */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden shadow-lg">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-xs">No Photo</span>
                    </div>
                  )}
                </div>
                
                {/* Hover overlay with quick actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={openFileDialog}
                      className="p-2 bg-neon-green/20 hover:bg-neon-green/30 rounded-lg transition-colors"
                      title="Change photo"
                    >
                      <Camera className="w-4 h-4 text-neon-green" />
                    </button>
                    {preview && (
                      <button
                        onClick={removeProfilePicture}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                    isDragOver
                      ? 'border-neon-green bg-neon-green/10'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-3 ${isDragOver ? 'text-neon-green' : 'text-slate-400'}`} />
                  <p className="text-sm font-medium text-slate-200 mb-1">
                    {isDragOver ? 'Drop your image here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="mt-3 text-xs text-slate-500">
                  <p>• Recommended size: 400x400 pixels</p>
                  <p>• Supported formats: PNG, JPG, GIF</p>
                  <p>• Maximum file size: 5MB</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button onClick={handleSave} icon={Save} loading={saving} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-200">Communication Channels</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                  />
                  <span className="text-sm text-slate-300">Email Notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                  />
                  <span className="text-sm text-slate-300">SMS Notifications</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-200">Alert Types</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={tradeAlerts}
                    onChange={(e) => setTradeAlerts(e.target.checked)}
                    className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                  />
                  <span className="text-sm text-slate-300">Trade Confirmations</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={priceAlerts}
                    onChange={(e) => setPriceAlerts(e.target.checked)}
                    className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                  />
                  <span className="text-sm text-slate-300">Price Alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                    className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                  />
                  <span className="text-sm text-slate-300">Security Alerts</span>
                </label>
              </div>
            </div>
          </div>
          <Button onClick={handleNotificationSave} icon={Save} className="w-full">
            Save Notification Preferences
          </Button>
        </div>
      </div>

      {/* Trading Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Trading Preferences</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Default Currency</label>
              <select 
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-green"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Risk Level</label>
              <select 
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-neon-green"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={autoConfirmTrades}
                onChange={(e) => setAutoConfirmTrades(e.target.checked)}
                className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
              />
              <span className="text-sm text-slate-300">Auto-confirm trades under $100</span>
            </label>
          </div>
          <Button onClick={handleTradingPreferencesSave} icon={Save} className="w-full">
            Save Trading Preferences
          </Button>
        </div>
      </div>

      {/* Theme & Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Theme & Display</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'auto'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => handleThemeChange(themeOption)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      theme === themeOption
                        ? 'bg-neon-green text-deep-black'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Display Mode</label>
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="w-4 h-4 text-neon-green bg-slate-700 border-slate-600 rounded focus:ring-neon-green"
                />
                <span className="text-sm text-slate-300">Compact Mode</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
          <h2 className="text-xl font-semibold text-white">Account Information</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
              <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
                {user?.email || 'Not provided'}
              </div>
              <p className="text-xs text-slate-500 mt-1">Email address cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">Member Since</label>
              <div className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
                {user?.id ? new Date(parseInt(user.id)).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-700">
            <Button variant="danger" className="w-full">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


