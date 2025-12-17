

import supabase from "../config/supabase.js";


// Get all skills
export const getSkills = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create skill
export const createSkill = async (req, res) => {
  try {
    const { name, icon, category, level, display_order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Skill name is required"
      });
    }

    const { data, error } = await supabase
      .from("skills")
      .insert([{ name, icon, category, level, display_order }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update skill
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from("skills")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Skill updated successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete skill
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Skill deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};