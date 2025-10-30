import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, UserProfile } from '../lib/supabase';
import {
  User,
  Mail,
  Phone,
  FileText,
  LogOut,
  Save,
  Edit3,
  AlertCircle,
  CheckCircle,
  Shield,
  Activity,
  Clock,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AvatarUpload from '../components/AvatarUpload';
import PasswordChangeModal from '../components/PasswordChangeModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile({ onNavigateToAdmin }: { onNavigateToAdmin?: () => void }) {
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error) {
      setError('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      await loadProfile();

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: url })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccess('Avatar updated successfully!');
      await loadProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update avatar');
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setIsEditing(false);
    setError('');
  };

  const handlePasswordChangeSuccess = () => {
    setSuccess('Password updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const getDaysSinceJoined = () => {
    if (!profile?.created_at) return 0;
    const created = new Date(profile.created_at);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <nav className="glass border-b border-white/30 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              Account Dashboard
            </h1>
            <div className="flex items-center gap-3">
              {isAdmin && onNavigateToAdmin && (
                <button
                  onClick={onNavigateToAdmin}
                  className="inline-flex items-center gap-2 px-4 py-2 glass text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:scale-105"
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Admin Dashboard</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 glass-dark text-white hover:bg-red-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-2xl shadow-2xl p-6 animate-slide-in-left">
              <div className="text-center">
                <AvatarUpload
                  avatarUrl={formData.avatar_url}
                  onUpload={handleAvatarUpload}
                />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {profile?.full_name || 'User'}
                </h2>
                <p className="text-gray-600 mt-1">{profile?.email}</p>
              </div>
            </div>

            <div className="glass rounded-2xl shadow-2xl p-6 animate-slide-in-left animation-delay-2000">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Account Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Days Active</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{getDaysSinceJoined()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {formData.full_name && formData.phone && formData.bio ? '100%' : '75%'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Last Updated</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">
                    {profile?.updated_at
                      ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full glass rounded-xl p-4 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group animate-slide-in-left animation-delay-4000"
            >
              <Shield className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-gray-900">Change Password</span>
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-slide-in-right">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
                <div className="flex items-center justify-between">
                  <div className="text-white">
                    <h2 className="text-2xl font-bold">Profile Information</h2>
                    <p className="text-blue-100 mt-1">Manage your personal details</p>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-slide-in-bottom">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-slide-in-bottom">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-blue-400"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled={true}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600 hover:border-blue-400"
                    placeholder="Add your phone number"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-600 resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 animate-slide-in-bottom">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-gray-600 font-medium mb-1">Account Created</p>
                  <p className="text-gray-900 font-semibold">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <p className="text-gray-600 font-medium mb-1">Last Updated</p>
                  <p className="text-gray-900 font-semibold">
                    {profile?.updated_at
                      ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordChangeSuccess}
        />
      )}
    </div>
  );
}
