import { supabase } from '../config/supabase.js';

export async function uploadToStorage(
  fileBuffer: Buffer,
  mimeType: string,
  folder = 'incidents'
): Promise<string> {
  const fileExt = mimeType.split('/')[1] || 'jpg';
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  try {
    const { data, error } = await supabase.storage
      .from('civic-media')
      .upload(fileName, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error) {
      console.warn('⚠️ Supabase Storage upload error (using fallback base64 URL):', error.message);
      // Return base64 data URL fallback so the demo never fails to render the image
      const base64 = fileBuffer.toString('base64');
      return `data:${mimeType};base64,${base64}`;
    }

    const { data: publicUrlData } = supabase.storage
      .from('civic-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err: any) {
    console.warn('⚠️ Exception during storage upload, utilizing fallback data URL:', err.message);
    const base64 = fileBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  }
}
