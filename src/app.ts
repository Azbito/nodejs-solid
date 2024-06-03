import fastify from 'fastify';
import { appRoutes } from './http/controllers/routes';
import { ZodError } from 'zod';
import { env } from './env';

export const app = fastify();

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({message: 'Validate error.', issues: error.format})
    }

    if (env.NODE_ENV != 'prod') {
        console.error(error)
    } else {
        // here we should use data log to store
    }

    return reply.status(500).send({message: "Internal server error."})
})