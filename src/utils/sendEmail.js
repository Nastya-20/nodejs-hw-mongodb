import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';
import "dotenv/config";
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';

export const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),

  },
});

export const sendEmail = async options => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw createHttpError(500, 'Failed to send the email, please try again later');
  }
};

