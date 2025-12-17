import { CONTACT_MESSAGE_TEMPLATE } from "../config/contactTemplate.js";
import transporter from "../config/nodemailer.js";
import supabase from "../config/supabase.js";


// Send message (public)
export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([{ name, email, message }])
      .select()
      .single();

    if (error) throw error;

    const html = CONTACT_MESSAGE_TEMPLATE
      .replace('{{name}}', name)
      .replace('{{email}}', email)
      .replace('{{message}}', message);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: process.env.ADMIN_EMAIL,   // jaha message receive hoga
      subject: "New Contact Form Message",
      html
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages (protected)
export const getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Message marked as read",
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};