import emailjs from "@emailjs/browser";

// Replace these with your EmailJS credentials
const EMAIL_SERVICE_ID = import.meta.env.VITE_EMAIL_SERVICE_ID;
const EMAIL_TEMPLATE_ID_CONTACT = import.meta.env
  .VITE_EMAIL_TEMPLATE_ID_CONTACT;
const EMAIL_TEMPLATE_ID_QUOTE = import.meta.env.VITE_EMAIL_TEMPLATE_ID_QUOTE;
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

export const submitContactForm = async (formData) => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAIL_PUBLIC_KEY);

    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID_CONTACT,
      templateParams
    );

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const submitQuoteRequest = async (formData) => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAIL_PUBLIC_KEY);

    // Simplified version without attachments
    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      phone: formData.phone || "Not provided",
      jewelry_type: formData.jewelryType,
      budget: formData.budget || "Not specified",
      description: formData.description,
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID_QUOTE,
      templateParams
    );

    return response;
  } catch (error) {
    console.error("Error sending quote request email:", error);
    throw error;
  }
};
