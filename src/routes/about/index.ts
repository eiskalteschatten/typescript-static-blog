import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.render('about/index.ejs', req, {
      title: 'About TypeScript Static Blog',
      mainNavId: 'about',
    });
  });
};
