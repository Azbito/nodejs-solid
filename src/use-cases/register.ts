import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
    name: string
    email: string
    password: string
}

export async function registerUseCase({name, email, password}: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 5)
    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (userWithSameEmail) {
        throw new Error('Email already exists')
    }

    const prismaUsersRepository = new PrismaUsersRepository()

    prismaUsersRepository.create({
        name, email, password_hash
    })
}