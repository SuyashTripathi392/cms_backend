import supabase from "../config/supabase.js";

// Get contact details
export const getContactDetails = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_details")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") throw error;

    res.json({ success: true, contact: data || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update contact details (admin)
export const updateContactDetails = async (req, res) => {
  try {
    const {
      email,
      phone,
      whatsapp,
      address,
      location,
      github,
      linkedin,
      twitter,
      instagram,
    } = req.body;

    const { data: existing } = await supabase
      .from("contact_details")
      .select("*")
      .single();

    let result;

    if (existing) {
      result = await supabase
        .from("contact_details")
        .update({
          email,
          phone,
          whatsapp,
          address,
          location,
          github,
          linkedin,
          twitter,
          instagram,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("contact_details")
        .insert([
          {
            email,
            phone,
            whatsapp,
            address,
            location,
            github,
            linkedin,
            twitter,
            instagram,
          },
        ])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.json({ success: true, contact: result.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
