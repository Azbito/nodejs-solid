import { PrismaUsersRepository } from "@/repositories/prisma/users-repository";
import { AuthenticateUseCase } from "@/use-cases/auth";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials";
import { makeAuthenticateUserCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string(),
        password: z.string().min(6),
    });

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUserCase()

        await authenticateUseCase.execute({
            email, password
        })
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(400).send({ message: err.message})
        }

        throw err
    }

    return reply.status(200).send();
};
