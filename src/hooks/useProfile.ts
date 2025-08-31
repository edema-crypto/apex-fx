import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      
      // Set up real-time subscription for profile changes
      const subscription = supabase
        .channel('profile_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'UPDATE') {
              setProfile(payload.new as Profile);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
        return false;
      }

      toast.success('Profile updated successfully!');
      await fetchProfile(); // Refresh profile data
      return true;
    } catch (error) {
      toast.error('An error occurred updating profile');
      return false;
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        toast.error('Failed to upload avatar');
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: data.publicUrl });
      return data.publicUrl;
    } catch (error) {
      toast.error('An error occurred uploading avatar');
      return null;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile
  };
};