import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

// Get all certificates
export const getCertificates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      certificates: data || []
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Get single certificate
export const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found"
      });
    }

    res.json({ success: true, certificate: data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create certificate
export const createCertificate = async (req, res) => {
  try {
    const {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      skills
    } = req.body;

    if (!title || !issuer || !issueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, issuer and issue date are required"
      });
    }

    // ✅ skills (JSON string → array)
    let skillsArray = [];
    if (skills) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = [];
      }
    }

    // ✅ image upload
    let imageUrl = null;
    if (req.file) {
      const file = req.file;
      const ext = file.originalname.split(".").pop();
      const fileName = `cert-${Date.now()}.${ext}`;

      imageUrl = await uploadToSupabase(
        "certificate_image",
        fileName,
        file.buffer,
        file.mimetype
      );
    }

    const { data, error } = await supabase
      .from("certificates")
      .insert([{
        title,
        issuer,
        issue_date: issueDate,
        expiry_date: expiryDate || null,
        credential_id: credentialId || null,
        credential_url: credentialUrl || null,
        image_url: imageUrl,
        skills: skillsArray
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      certificate: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Update certificate
export const updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      skills
    } = req.body;

    // ✅ skills parse
    let skillsArray;
    if (skills !== undefined) {
      try {
        skillsArray = JSON.parse(skills);
      } catch {
        skillsArray = [];
      }
    }

    // ✅ image upload (optional)
    let imageUrl;
    if (req.file) {
      const file = req.file;
      const ext = file.originalname.split(".").pop();
      const fileName = `cert-${Date.now()}.${ext}`;

      imageUrl = await uploadToSupabase(
        "certificate_image",
        fileName,
        file.buffer,
        file.mimetype
      );
    }

    const { data, error } = await supabase
      .from("certificates")
      .update({
        title,
        issuer,
        issue_date: issueDate,
        expiry_date: expiryDate || null,
        credential_id: credentialId || null,
        credential_url: credentialUrl || null,
        skills: skillsArray,
        ...(imageUrl && { image_url: imageUrl })
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      certificate: data
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Delete certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("certificates")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Certificate deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};








// import supabase from "../config/supabase.js";
// import { uploadToSupabase } from "../utils/uploadToSupabase.js";

// // Get all certificates
// export const getCertificates = async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("certificates")
//       .select("*")
//       .order("display_order", { ascending: true })
//       .order("issue_date", { ascending: false });

//     if (error) throw error;

//     res.json({ 
//       success: true, 
//       data: data || [] 
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// // Get single certificate
// export const getCertificateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data, error } = await supabase
//       .from("certificates")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) throw error;

//     if (!data) {
//       return res.status(404).json({
//         success: false,
//         message: "Certificate not found"
//       });
//     }

//     res.json({ success: true, data });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// // Create certificate
// // export const createCertificate = async (req, res) => {
// //   try {
// //     const { 
// //       title, 
// //       issuer, 
// //       issue_date, 
// //       credential_url, 
// //       image_url, 
// //       skills 
// //     } = req.body;

// //     if (!title) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Certificate title is required"
// //       });
// //     }

// //     const { data, error } = await supabase
// //       .from("certificates")
// //       .insert([{
// //         title,
// //         issuer: issuer || null,
// //         issue_date: issue_date || new Date().toISOString().split('T')[0],
// //         credential_url: credential_url || null,
// //         image_url: image_url || null,
// //         skills: Array.isArray(skills) ? skills : []
// //       }])
// //       .select()
// //       .single();

// //     if (error) throw error;

// //     res.status(201).json({
// //       success: true,
// //       message: "Certificate added successfully",
// //       data
// //     });
// //   } catch (error) {
// //     res.status(500).json({ 
// //       success: false, 
// //       message: error.message 
// //     });
// //   }
// // };




// export const createCertificate = async (req, res) => {
//   try {
//     let { 
//       title, 
//       issuer, 
//       issue_date, 
//       credential_url, 
//       skills 
//     } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Certificate title is required"
//       });
//     }

//     // --- Parse skills ---
//     if (skills && typeof skills === "string") {
//       try {
//         skills = JSON.parse(skills);
//       } catch {
//         skills = skills
//           .split(",")
//           .map(s => s.trim())
//           .filter(s => s.length > 0);
//       }
//     } else {
//       skills = [];
//     }

//     // --- Handle Image Upload ---
//     let image_url = null;

//     if (req.file) {
//       const file = req.file;
//       const ext = file.originalname.split(".").pop();
//       const fileName = `cert-${Date.now()}.${ext}`;

//       image_url = await uploadToSupabase(
//         "certificate_image",
//         fileName,
//         file.buffer,
//         file.mimetype
//       );
//     }

//     // --- Insert into Supabase database ---
//     const { data, error } = await supabase
//       .from("certificates")
//       .insert([
//         {
//           title,
//           issuer: issuer || null,
//           issue_date: issue_date || new Date().toISOString().split("T")[0],
//           credential_url: credential_url || null,
//           image_url: image_url, // from Supabase upload
//           skills: skills
//         }
//       ])
//       .select()
//       .single();

//     if (error) throw error;

//     res.status(201).json({
//       success: true,
//       message: "Certificate added successfully",
//       data
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // Update certificate
// export const updateCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const { data, error } = await supabase
//       .from("certificates")
//       .update(updateData)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;

//     res.json({
//       success: true,
//       message: "Certificate updated successfully",
//       data
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };

// // Delete certificate
// export const deleteCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { error } = await supabase
//       .from("certificates")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;

//     res.json({
//       success: true,
//       message: "Certificate deleted successfully"
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: error.message 
//     });
//   }
// };