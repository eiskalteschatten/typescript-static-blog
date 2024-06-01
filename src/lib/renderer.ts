import { FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { FastifyInstanceWithView, PartialQuery } from '@/interfaces/fastify.interface';

export interface RenderOptions {
  template: string;
  title?: string;
  request: FastifyRequest;
  pageData?: Record<string, any>;
}

export default fastifyPlugin(function(fastify: FastifyInstanceWithView, options: Record<string, any>, done: () => void): void {
  fastify.decorateReply('render', async function (renderOptions: RenderOptions): Promise<void> {
    const { template, title, request, pageData } = renderOptions;
    this.type('text/html');

    const query = request.query as PartialQuery;

    if ('_partial' in query) {
      const html = await fastify.renderPartial(template, { ...pageData });
      return this.send({ html, title });
    }

    const html = await fastify.renderFullPage(template, { title, ...pageData });
    return this.send(html);
  });

  done();
});
