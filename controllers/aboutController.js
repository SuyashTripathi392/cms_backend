// controllers/aboutController.js
import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

// ---------------------------
// 1) GET ABOUT (PUBLIC)
// ---------------------------
export const getAbout = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .limit(1)
      .single();

    // (PGRST116 = no rows found)
    if (error && error.code !== "PGRST116") throw error;

    // Agar table empty hai
    if (!data) {
      return res.json({
        success: true,
        data: {
          title: "Your Name",
          description: "Full Stack Developer",
          image: null,
        },
      });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------------------
// 2) UPDATE TITLE + DESCRIPTION (ADMIN)
// ---------------------------
export const updateAbout = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check existing about record
    const { data: existing } = await supabase
      .from("about")
      .select("id")
      .limit(1)
      .single();

    let result, error;

    if (existing) {
      // UPDATE
      ({ data: result, error } = await supabase
        .from("about")
        .update({ title, description })
        .eq("id", existing.id)
        .select()
        .single());
    } else {
      // INSERT
      ({ data: result, error } = await supabase
        .from("about")
        .insert([{ title, description, image: null }])
        .select()
        .single());
    }

    if (error) throw error;

    res.json({
      success: true,
      message: "About updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------------------
// 3) UPDATE IMAGE (ADMIN)
// ---------------------------
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.json({
        success: false,
        message: "No file found",
      });
    }

    // File name = timestamp.extension
    const ext = file.originalname.split(".").pop();
    const fileName = `about-${Date.now()}.${ext}`;

    // Upload to Supabase bucket
    const imageUrl = await uploadToSupabase(
      "profile_image",
      fileName,
      file.buffer,
      file.mimetype
    );

    // Update about table
    const { data: existing } = await supabase
      .from("about")
      .select("id")
      .limit(1)
      .single();

    let error;

    if (existing) {
      ({ error } = await supabase
        .from("about")
        .update({ image: imageUrl })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("about")
        .insert([{ title: "Your Name", description: "Developer", image: imageUrl }]));
    }

    if (error) throw error;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      image: imageUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
