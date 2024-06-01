import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { PartialQuery } from '@/interfaces/fastify.interface';
import mainNav from '@/mainNav';
import * as ejsHelpers from '@/lib/ejsHelpers';

export interface RenderOptions {
  title?: string;
  req: FastifyRequest;
  pageData?: Record<string, any>;
}

export default fastifyPlugin(function(fastify: FastifyInstance, options: Record<string, any>, done: () => void): void {
  fastify.decorateReply('render', async function (template: string, renderOptions: RenderOptions): Promise<FastifyReply> {
    const locals = {
      mainNav,
      helpers: ejsHelpers,
      isDev: process.env.NODE_ENV === 'development',
    };

    const { title, req, pageData } = renderOptions;
    const query = req.query as PartialQuery;

    if ('_partial' in query) {
      const html = await fastify.renderPartial(template, { ...pageData, ...locals });
      return this.send({ html, title });
    }

    this.type('text/html');
    return fastify.renderFullPage(template, { title, ...pageData, ...locals });
  });

  done();
});
