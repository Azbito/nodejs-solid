import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./auth";
import { profile } from "./profile";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)
    
    // Authenticated
    app.get('/me', profile)
}