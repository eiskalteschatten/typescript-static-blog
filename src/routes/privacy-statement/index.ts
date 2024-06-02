import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.render('privacy-statement/index.ejs', req, {
      title: 'Privacy Statement',
    });
  });
};
