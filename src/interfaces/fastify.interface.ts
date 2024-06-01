import { FastifyInstance, FastifyReply } from 'fastify';

import { RenderOptions } from '@/lib/renderer';

// Copied from node_modules/@fastify/types/index.d.ts
interface RouteSpecificOptions {
  layout?: string;
}

// Temporary workaround for https://github.com/fastify/point-of-view/issues/301
export interface FastifyReplyWithView extends FastifyReply {
  view: never;
  renderFullPage<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
  renderFullPage(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
  renderPartial<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
  renderPartial(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
  render(template: string, renderOptions: RenderOptions): FastifyReply;
}

// Temporary workaround for https://github.com/fastify/point-of-view/issues/301
export interface FastifyInstanceWithView extends FastifyInstance {
  view: never;
  renderFullPage<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): Promise<string>;
  renderFullPage(page: string, data?: object, opts?: RouteSpecificOptions): Promise<string>;
  renderPartial<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): Promise<string>;
  renderPartial(page: string, data?: object, opts?: RouteSpecificOptions): Promise<string>;
}

export interface PartialQuery {
  _partial?: boolean;
}
