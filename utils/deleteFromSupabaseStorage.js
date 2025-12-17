import { supabase } from "../db.js";


export const deleteFromSupabaseStorage = async (publicUrl, bucket ) => {
  try {
    console.log(publicUrl)
    const fileName = publicUrl?.split("/").pop(); // extract filename
    console.log(fileName)
    if (!fileName) return;

    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      console.warn("⚠️ Failed to delete file:", fileName, error.message);
    } else {
      console.log("🗑️ Deleted file from Supabase:", fileName);
    }
  } catch (err) {
    console.error("❌ Error in deleteFromSupabaseStorage:", err.message);
  }
};