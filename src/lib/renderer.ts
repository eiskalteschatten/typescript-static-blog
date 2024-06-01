import { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { FastifyInstanceWithView, PartialQuery } from '@/interfaces/fastify.interface';
import mainNav from '@/mainNav';
import * as ejsHelpers from '@/lib/ejsHelpers';

export interface RenderOptions {
  title?: string;
  req: FastifyRequest;
  pageData?: Record<string, any>;
}

export default fastifyPlugin(function(fastify: FastifyInstanceWithView, options: Record<string, any>, done: () => void): void {
  fastify.decorateReply('render', async function (template: string, renderOptions: RenderOptions): Promise<FastifyReply> {
    this.type('text/html');

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

    const html = await fastify.renderFullPage(template, { title, ...pageData, ...locals });
    return this.send(html);
  });

  done();
});
