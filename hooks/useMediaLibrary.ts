import { useState, useCallback, useEffect } from 'react';

export interface MediaItem {
  name: string;
  created_at: string;
  url: string;
  path: string;
  folder: string;
  id?: string;
}

export interface MediaUsage {
  used: number;
  limit: number;
  percentage: number;
}

export function useMediaLibrary() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [usage, setUsage] = useState<MediaUsage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load media library
  const loadMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/media');
      if (!res.ok) throw new Error('Failed to load media');
      const data = await res.json();
      setMediaList(data.files || []);
      setUsage(data.usage || null);
      console.log('[useMediaLibrary] Media loaded:', data.files?.length, 'items');
    } catch (err: any) {
      console.error('[useMediaLibrary] Error loading media:', err);
      setError(err.message || 'Failed to load media');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return null;
    }

    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      console.log('[useMediaLibrary] Image uploaded:', data.url);
      // Refresh media list after upload
      await loadMedia();
      return data.url as string;
    } catch (err: any) {
      console.error('[useMediaLibrary] Upload error:', err);
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [loadMedia]);

  // Delete media file
  const deleteMedia = useCallback(async (path: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        body: JSON.stringify({ path }),
      });
      if (!res.ok) throw new Error('Failed to delete media');
      
      console.log('[useMediaLibrary] Media deleted:', path);
      // Refresh media list after deletion
      await loadMedia();
      return true;
    } catch (err: any) {
      console.error('[useMediaLibrary] Delete error:', err);
      setError(err.message || 'Delete failed');
      return false;
    }
  }, [loadMedia]);

  // Load media on mount
  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  return {
    mediaList,
    usage,
    isLoading,
    isUploading,
    error,
    loadMedia,
    uploadFile,
    deleteMedia,
  };
}
