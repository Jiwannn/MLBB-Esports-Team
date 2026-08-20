import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_tws4xbe';
const EMAILJS_TEMPLATE_ID = 'template_ja6j1mp';
const EMAILJS_PUBLIC_KEY = 'mvm6kV20Y0pJ_wYza';

export const sendRegistrationEmail = async (registrationData) => {
  try {
    console.log('Sending email to:', registrationData.gmail);
    
    const templateParams = {
      to_email: registrationData.gmail,
      to_name: registrationData.captainName || 'Team Captain',
      team_name: registrationData.teamName || 'Unknown Team',
      registration_status: (registrationData.status || 'pending').toUpperCase().replace('_', ' '),
      registration_fee: registrationData.registrationFee > 0 ? `₱${registrationData.registrationFee}` : 'FREE',
      message: registrationData.status === 'approved' 
        ? 'Congratulations! Your team has been approved for the tournament!'
        : registrationData.status === 'rejected'
        ? 'Unfortunately, your team registration was rejected.'
        : 'Your registration has been received.',
    };

    console.log('Template params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Email sent successfully!', response);
    return response;
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw error;
  }
};