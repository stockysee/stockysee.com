import { getSupabaseClient } from './supabase';
import { getPlanConfig } from './plan-limits';
import prisma from './db';

/**
 * Uploads a file or base64 string to Supabase Storage
 * Now with built-in quota enforcement!
 */
export async function uploadToSupabase(path: string, fileData: any, contentType: string = 'image/png', bucket = 'tenant-assets') {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase missing");

    // --- FILE SIZE LIMIT ---
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    let currentFileSize = 0;
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const base64Data = fileData.split(',')[1];
      currentFileSize = Buffer.from(base64Data, 'base64').length;
    } else if (fileData instanceof Blob) {
      currentFileSize = fileData.size;
    } else if (Buffer.isBuffer(fileData)) {
      currentFileSize = fileData.length;
    }

    if (currentFileSize > MAX_FILE_SIZE) {
      throw new Error("FILE_TOO_LARGE");
    }

    // --- QUOTA ENFORCEMENT ---
    // Extract clientId from path (format: uploads/{clientId}/...)
    const pathParts = path.split('/');
    const clientId = pathParts[0] === 'uploads' ? pathParts[1] : null;

    if (clientId) {
      const client = await prisma.client.findUnique({ 
        where: { id: clientId },
        select: { plan: true }
      });

      if (client) {
        const currentUsage = await getStorageUsage(clientId);
        const planConfig = getPlanConfig(client.plan);
        
        // Calculate size of new file
        let newSize = 0;
        if (typeof fileData === 'string' && fileData.startsWith('data:')) {
          const base64Data = fileData.split(',')[1];
          newSize = Buffer.from(base64Data, 'base64').length;
        } else if (fileData instanceof Blob) {
          newSize = fileData.size;
        } else if (Buffer.isBuffer(fileData)) {
          newSize = fileData.length;
        }

        if (currentUsage + newSize > planConfig.storageLimit) {
          throw new Error("QUOTA_EXCEEDED");
        }
      }
    }

    let body: any = fileData;
    let finalContentType = contentType;

    // Handle Base64 String
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const response = await fetch(fileData);
      body = await response.blob();
      finalContentType = body.type;
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, body, {
        contentType: finalContentType,
        upsert: true
      });

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  } catch (err: any) {
    console.error('Storage Helper Error:', err);
    throw err;
  }
}

/**
 * Calculates the total storage usage for a specific client in bytes
 * @param clientId The client ID
 * @param bucket The bucket name
 * @returns Total size in bytes
 */
export async function getStorageUsage(clientId: string, bucket = 'tenant-assets') {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return 0;

    // Fetch client to get KTP/QRIS URLs for exclusion
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { ktpUrl: true, qrisUrl: true }
    });

    // We need to check the root, subfolders, and legacy folders
    const folders = [
      `uploads/${clientId}`,
      `uploads/${clientId}/products`,
      `uploads/${clientId}/categories`,
      `products/${clientId}` // Legacy folder
    ];
    
    let totalSize = 0;

    for (const path of folders) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: 1000,
          offset: 0,
        });

      if (!error && data) {
        // Filter out KTP and QRIS if we are in the root or uploads folder
        const filteredFiles = data.filter((file: any) => {
          if (!file.id) return false; // Skip folders
          
          const fullPath = `${path}/${file.name}`;
          // Construction check: does this file match the currently stored identity assets?
          if (client?.ktpUrl?.includes(fullPath)) return false;
          if (client?.qrisUrl?.includes(fullPath)) return false;
          
          return true;
        });

        totalSize += filteredFiles.reduce((acc: any, file: any) => acc + (file.metadata?.size || 0), 0);
      }
    }

    return totalSize;
  } catch (err) {
    console.error('getStorageUsage Error:', err);
    return 0;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path Full path to the file
 * @param bucket Bucket name
 */
export async function deleteFromSupabase(path: string, bucket = 'tenant-assets') {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase missing");

    // Remove bucket prefix if exists in the path
    const cleanPath = path.startsWith(bucket + '/') ? path.replace(bucket + '/', '') : path;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([cleanPath]);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('deleteFromSupabase Error:', err);
    throw err;
  }
}
