import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import formBody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import { fastifyAutoload } from '@fastify/autoload';
import type { FastifyCookieOptions } from '@fastify/cookie';
import cookie from '@fastify/cookie';
import ejs from 'ejs';
import path from 'path';
import minifier from 'html-minifier';

// import Stats from './stats/Stats';
import renderer from './lib/renderer';

const port = Number(process.env.PORT) || 4000;

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
  ignoreTrailingSlash: true,
});

// type CustomRequest = FastifyRequest<{ Querystring: { noStats?: number } }>;
// app.addHook('preHandler', (req: CustomRequest, reply: FastifyReply, done: DoneFuncWithErrOrRes) => {
//   if (!req.url.match(Stats.excludeFromStats)) {
//     const noStatsParam = Number(req.query.noStats);
//     const noStats = req.cookies?.noStats === 'true' || noStatsParam === 1;

//     if (noStatsParam === 1) {
//       reply.setCookie('noStats', 'true', {
//         path: '/',
//         // Expires in a year
//         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
//       });
//     }

//     if (!noStats) {
//       const stats = new Stats();
//       // Don't await this so that the request can be processed without waiting for the stats to be written
//       stats.addPageHit(req.url);
//     }
//   }

//   done();
// });

app.register(formBody);

app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
} as FastifyCookieOptions);

app.register(fastifyView, {
  engine: { ejs },
  root: './templates',
  layout: '_layout.ejs',
  propertyName: 'renderFullPage',
});

app.register(fastifyView, {
  engine: { ejs },
  root: './templates',
  propertyName: 'renderPartial',
  options: {
    useHtmlMinifier: minifier,
    htmlMinifierOptions: {
      removeComments: true,
      removeCommentsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
    },
  },
});

app.register(renderer);

app.register(helmet, {
  global: true,
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      /* eslint-disable quotes */
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      frameSrc: ["'self'", 'https://www.youtube.com'],
      /* eslint-enable quotes */
      ...process.env.NODE_ENV === 'development' && {
        'upgrade-insecure-requests': null,
      },
    },
  },
});

app.register(fastifyAutoload, {
  dir: path.join(__dirname, 'routes'),
});

app.register(fastifyStatic, {
  root: path.join(process.cwd(), 'public'),
});

app.setNotFoundHandler((req: FastifyRequest, reply: FastifyReply) => {
  reply.render('404.ejs', {
    req,
    title: 'Page Not Found',
  });
});

app.listen({ port }, error => {
  if (error) {
    throw error;
  }
});

export default app;
