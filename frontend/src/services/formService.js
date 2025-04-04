import emailjs from '@emailjs/browser';

// Replace these with your EmailJS credentials
const EMAIL_SERVICE_ID = 'service_pfhkymo';  // e.g., 'gmail'
const EMAIL_TEMPLATE_ID_CONTACT = 'template_g9ga303';
const EMAIL_TEMPLATE_ID_QUOTE = 'template_gg5s5im';
const EMAIL_PUBLIC_KEY = 'ZH6ZqCoA79wzKztW_';

export const submitContactForm = async (formData) => {
  try {
    // Initialize EmailJS with your public key
    emailjs.init(EMAIL_PUBLIC_KEY);
    
    const templateParams = {
      from_name: formData.name,
      reply_to: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID_CONTACT,
      templateParams
    );
    
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
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
      phone: formData.phone || 'Not provided',
      jewelry_type: formData.jewelryType,
      budget: formData.budget || 'Not specified',
      description: formData.description
    };

    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID_QUOTE,
      templateParams
    );
    
    console.log('Quote request email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending quote request email:', error);
    throw error;
  }
}; 