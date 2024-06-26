import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import logger from '@/lib/logger';
import transporter from '@/lib/mailTransporter';

interface EmailData {
  name: string;
  email: string;
  message: string;
}

const generateHtml = (emailData: EmailData): string => {
  return `<html>
    <head>
      <title>${emailData.name}</title>
    </head>
    <body>
      <p>
        <b>Name:</b> ${emailData.name}<br>
        <b>Email:</b> ${emailData.email}
      </p>
      <p><b>Message:</b></p>
      <p>${emailData.message}</p>
    </body>
  </html>`;
};

export default async (app: FastifyInstance) => {
  app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    return reply.render('contact.ejs', req, {
      title: 'Contact',
    });
  });

  type ContactFormRequest = FastifyRequest<{ Body: EmailData }>;
  app.post('/', async (req: ContactFormRequest, reply: FastifyReply) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'alex@alexseifert.com',
        subject: 'Email from TypeScript Static Blog',
        html: generateHtml(req.body),
      });

      return reply.render('contact.ejs', req, {
        title: 'Contact',
        success: true,
      });
    }
    catch (error) {
      logger.error(error);

      return reply.render('contact.ejs', req, {
        title: 'Contact',
        error: true,
      });
    }
  });
};
