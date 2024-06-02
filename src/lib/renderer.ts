import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { PartialQuery } from '@/interfaces/fastify.interface';
import mainNav from '@/mainNav';
import * as ejsHelpers from '@/lib/ejsHelpers';

export interface RenderOptions extends Record<string, any> {
  title?: string;
}

export default fastifyPlugin(function(fastify: FastifyInstance, options: Record<string, any>, done: () => void): void {
  fastify.decorateReply('render', async function (template: string, req: FastifyRequest, renderOptions?: RenderOptions): Promise<FastifyReply> {
    const locals = {
      mainNav,
      helpers: ejsHelpers,
      isDev: process.env.NODE_ENV === 'development',
    };

    const templateData = {
      ...renderOptions,
      ...locals,
    };

    const query = req.query as PartialQuery;

    if (query && '_partial' in query) {
      const html = await fastify.renderPartial(template, templateData);
      return this.send({ html, title: renderOptions?.title });
    }

    this.type('text/html');
    return fastify.renderFullPage(template, templateData);
  });

  done();
});
