import { useState } from 'react';
import { Upload, Camera, User } from 'lucide-react';

interface AvatarUploadProps {
  avatarUrl?: string;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ avatarUrl, onUpload }: AvatarUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onUpload(base64String);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <User className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        <label
          htmlFor="avatar-upload"
          className={`absolute inset-0 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center ${
            isHovered ? 'bg-black bg-opacity-50' : 'bg-transparent'
          }`}
        >
          {isHovered && !uploading && (
            <div className="text-white animate-scale-in">
              <Camera className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs font-medium">Change</p>
            </div>
          )}
          {uploading && (
            <div className="text-white">
              <Upload className="w-8 h-8 animate-bounce" />
            </div>
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-float">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
