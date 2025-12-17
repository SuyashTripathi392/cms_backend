import supabase from "../config/supabase.js";
import { uploadToSupabase } from "../utils/uploadToSupabase.js";

export const signup = async (req, res) => {
  try {
    const { email, password, name, role = 'admin' } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields (email, password, name, role) are required",
      });
    }

    const { data, error: existingError } = await supabase
      .from("users")
      .select('*')
      .eq('email', email).single()



    if (data) {
      return res.json({
        success: false,
        message: "User already registered"
      })
    }

    // 1️⃣ Supabase Auth me user create karo with metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role, // ✅ metadata me store
        },
      },
    });

    if (authError) {
      return res.status(400).json({ success: false, message: authError.message });
    }

    const userId = authData.user.id;

    // 2️⃣ Custom "users" table me record insert karo
    const { error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          name,
          email,
          role, // ✅ table me bhi store
        },
      ]);

    if (profileError) {
      return res.status(400).json({ success: false, message: profileError.message });
    }

    // 3️⃣ Response
    res.status(201).json({
      success: true,
      message: "Signup successful! Please verify your email.",
      user: authData.user,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


  export const uploadImage = async (req, res) => {
    try {
      const { id } = req.user
    const file = req.file
    if (!file) {
      return res.json({
        success: false,
        message: "No file found"
      })
    }

    const originalname = file.originalname
    const ext = originalname.split('.').pop()
    const fileName = `${id}.${ext}`


    const image = await uploadToSupabase(
      'profile_image',
      fileName,
      file.buffer,
      file.mimetype
    )
    
    const { data, error } = await supabase
    .from("users")
    .update({ image })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // 👇 Update auth metadata
  await supabase.auth.admin.updateUserById(id, {
    user_metadata: {
      image: image
    }
  });

    res.json({
      success:true,
      message:'Profile image added  successfully'
    })

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    
  }

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & password required" });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const user = data.user
    const user_metadata = user.user_metadata

    const loginUser = {
      id: user.id,
      email: user_metadata.email,
      name: user_metadata.name,
      role: user_metadata.role,
      image: user_metadata.image 
    }

    const token = data.session?.access_token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Login successful", loginUser, user, user_metadata,token });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 🟢 Get Profile
export const profile = async (req, res) => {
  try {
    const user = req.user; // from middleware
    const user_metadata = user.user_metadata


    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }


    res.json({ success: true, user, profile });
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// 🟢 Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
