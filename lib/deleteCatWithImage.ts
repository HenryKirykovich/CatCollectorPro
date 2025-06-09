import { supabase } from './supabase';

export async function deleteCatWithImage(cat: { id: string; image?: string }) {
  try {
    if (cat.image) {
      // 1. Очистить URL от двойных слешей
      const cleanedUrl = cat.image.replace(/\/\/+/g, '/');

      // 2. Извлечь имя файла из URL
      const fileName = cleanedUrl.split('/').pop()?.split('?')[0]; // убираем query-параметры

      if (fileName) {
        const { error: storageError } = await supabase
          .storage
          .from('cat-images')
          .remove([fileName]);

        if (storageError) {
          console.warn('⚠️ Storage deletion failed:', storageError.message);
        } else {
          console.log('✅ Image deleted from storage:', fileName);
        }
      } else {
        console.warn('⚠️ Could not extract filename from image URL:', cat.image);
      }
    }

    // Удалить запись из таблицы
    const { error: dbError } = await supabase
      .from('cats')
      .delete()
      .eq('id', cat.id);

    if (dbError) throw dbError;

    return true;
  } catch (e) {
    console.error('❌ Failed to delete:', e);
    return false;
  }
}
