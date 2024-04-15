import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('privacy-statement/index.ejs', {
      title: 'Privacy Statement',
    });
  });
};
