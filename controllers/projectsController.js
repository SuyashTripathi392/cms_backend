

import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";


// Get all projects
export const getProjects = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single project
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create project
// export const createProject = async (req, res) => {
//   try {
//     const { title, description, link, github,  tech_stack, featured } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Project title is required"
//       });
//     }

//      const file = req.file;

//     if (!file) {
//       return res.json({
//         success: false,
//         message: "No file found",
//       });
//     }

//     // File name = timestamp.extension
//     const ext = file.originalname.split(".").pop();
//     const fileName = `about-${Date.now()}.${ext}`;

//     // Upload to Supabase bucket
//     const imageUrl = await uploadToSupabase(
//       "project_image",
//       fileName,
//       file.buffer,
//       file.mimetype,
//     );



//     const { data, error } = await supabase
//       .from("projects")
//       .insert([{
//         title,
//         description,
//         link,
//         github,
//         image:imageUrl,
//         tech_stack: Array.isArray(tech_stack) ? tech_stack : [],
//         featured: featured || false
//       }])
//       .select()
//       .single();

//     if (error) throw error;

//     res.status(201).json({
//       success: true,
//       message: "Project created successfully",
//       data
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Create project
export const createProject = async (req, res) => {
  try {
    let { title, description, link, github, tech_stack, featured } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }

    const file = req.file;
    if (!file) {
      return res.json({ success: false, message: "No file found" });
    }

    const ext = file.originalname.split(".").pop();
    const fileName = `project-${Date.now()}.${ext}`;

    const imageUrl = await uploadToSupabase(
      "project_image",
      fileName,
      file.buffer,
      file.mimetype
    );

    // ✅ Convert tech_stack from string (JSON) to array
    if (tech_stack && typeof tech_stack === "string") {
      try {
        tech_stack = JSON.parse(tech_stack);
      } catch (err) {
        tech_stack = tech_stack.split(",").map(t => t.trim()).filter(t => t);
      }
    } else {
      tech_stack = [];
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([{
        title,
        description,
        link,
        github,
        image: imageUrl,
        tech_stack,
        featured: featured || false
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: "Project created successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Update project
// export const updateProject = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const { data, error } = await supabase
//       .from("projects")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     res.json({
//       success: true,
//       message: "Project updated successfully",
//       data
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, github, tech_stack, featured } = req.body;
    let imageUrl;

    // Agar image upload hui ho
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const fileName = `project-${Date.now()}.${ext}`;
      imageUrl = await uploadToSupabase(
        'project_image',
        fileName,
        req.file.buffer,
        req.file.mimetype
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        description,
        link,
        github,
        featured: featured || false,
        tech_stack: tech_stack ? JSON.parse(tech_stack) : [],
        ...(imageUrl && { image: imageUrl }) // agar image upload hui ho tab hi update
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: 'Project updated successfully', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};