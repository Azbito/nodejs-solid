import fastify from 'fastify';
import { appRoutes } from './http/controllers/routes';

export const app = fastify();

app.register(appRoutes)