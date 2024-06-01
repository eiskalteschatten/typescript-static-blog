import { RenderOptions } from './lib/renderer';
import { MainNavItem } from './mainNav';

declare module 'fastify' {
  interface FastifyReply {
    locals: {
      mainNav: MainNavItem[];
      helpers: any;
      isDev: boolean;
    };

    renderFullPage<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
    renderFullPage(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
    renderPartial<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
    renderPartial(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
    render(template: string, renderOptions: RenderOptions): Promise<FastifyReply>;
  }

  interface FastifyInstance {
    renderFullPage<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
    renderFullPage(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
    renderPartial<T extends { [key: string]: any }>(page: string, data: T, opts?: RouteSpecificOptions): FastifyReply;
    renderPartial(page: string, data?: object, opts?: RouteSpecificOptions): FastifyReply;
    render(template: string, renderOptions: RenderOptions): Promise<FastifyReply>;
  }
}
