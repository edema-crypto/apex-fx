import React, { useRef } from 'react';
import { Upload, FileImage, CheckCircle, Send } from 'lucide-react';
import Button from '../UI/Button';

interface ProofUploadProps {
  onUpload: (file: File) => void;
  onConfirm: () => void;
  hasProof: boolean;
}

const ProofUpload: React.FC<ProofUploadProps> = ({ onUpload, onConfirm, hasProof }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        onClick={triggerFileInput}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${hasProof 
            ? 'border-neon-green/50 bg-neon-green/5' 
            : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl inline-block ${
            hasProof ? 'bg-neon-green/10 animate-glow' : 'bg-slate-600/50'
          }`}>
            {hasProof ? (
              <CheckCircle className="w-8 h-8 text-neon-green" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400" />
            )}
          </div>
          
          <div>
            <h3 className={`font-semibold mb-2 ${
              hasProof ? 'text-neon-green' : 'text-white'
            }`}>
              {hasProof ? 'Proof Uploaded Successfully' : 'Upload Proof of Payment'}
            </h3>
            <p className="text-slate-400 text-sm">
              {hasProof 
                ? 'Click to upload a different file if needed' 
                : 'Upload a screenshot or receipt of your transaction'
              }
            </p>
          </div>
        </div>
      </div>

      {/* File Types */}
      <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
        <div className="flex items-center">
          <FileImage className="w-4 h-4 mr-2" />
          Images (JPG, PNG)
        </div>
        <div className="flex items-center">
          <FileImage className="w-4 h-4 mr-2" />
          PDF Documents
        </div>
      </div>

      {/* Confirm Button */}
      {hasProof && (
        <Button 
          onClick={onConfirm} 
          className="w-full" 
          icon={Send}
          variant="success"
        >
          Submit Deposit Request
        </Button>
      )}

      {/* Instructions */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4">
        <h4 className="font-medium text-white mb-2">What to include in your proof:</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Transaction hash/ID</li>
          <li>• Sender and receiver addresses</li>
          <li>• Transaction amount and timestamp</li>
          <li>• Clear, readable screenshot</li>
        </ul>
      </div>
    </div>
  );
};

export default ProofUpload;