import twilio from 'twilio';
import nodemailer from 'nodemailer';

/**
 * Envía un mensaje de texto (SMS) a través de Twilio.
 * @param {string} toPhoneNumber - Número de teléfono del destinatario
 * @param {string} message - Contenido del mensaje de texto
 * @returns {Promise<boolean>} True si se envió con éxito, false en caso contrario
 */
export async function sendSMS(toPhoneNumber, message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    console.warn('⚠️ Twilio no está configurado en las variables de entorno. Se omite el envío de SMS real.');
    return false;
  }

  try {
    const client = twilio(accountSid, authToken);
    const formattedPhone = toPhoneNumber.startsWith('+') ? toPhoneNumber : `+57${toPhoneNumber}`;
    
    const response = await client.messages.create({
      body: message,
      from: fromPhone,
      to: formattedPhone
    });
    
    console.log(`📲 SMS enviado con éxito a ${formattedPhone}. SID: ${response.sid}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar SMS con Twilio:', error.message);
    throw error;
  }
}

/**
 * Envía un correo electrónico a través de Nodemailer usando SMTP (Gmail).
 * @param {string} toEmail - Correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} htmlContent - Contenido en formato HTML
 * @returns {Promise<boolean>} True si se envió con éxito, false en caso contrario
 */
export async function sendEmail(toEmail, subject, htmlContent) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ Servidor SMTP no está configurado en las variables de entorno. Se omite el envío de correo real.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const info = await transporter.sendMail({
      from: `"SADYA" <${smtpUser}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent
    });

    console.log(`✉️ Correo enviado con éxito a ${toEmail}. MessageID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('❌ Error al enviar correo con Nodemailer:', error.message);
    throw error;
  }
}
