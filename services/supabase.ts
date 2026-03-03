
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseEnabled = !!supabase;

export const uploadImage = async (file: File | Blob, folder: string = 'site-images'): Promise<string | null> => {
  if (!supabase || !isSupabaseEnabled) return null;

  const fileExt = 'jpg';
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Erro no upload para Supabase:', error);
    return null;
  }
};

export const listImages = async (folder: string = 'site-images'): Promise<string[]> => {
  if (!supabase || !isSupabaseEnabled) return [];

  try {
    const { data, error } = await supabase.storage
      .from('images')
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) throw error;

    return data.map(file => {
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`${folder}/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('Erro ao listar imagens do Supabase:', error);
    return [];
  }
};
