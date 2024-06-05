import { PrismaUsersRepository } from "@/repositories/prisma/users-repository"
import { RegisterUseCase } from "../register"

export function makeRegisterUserCase() {
    const prismaUsersReposity = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersReposity)

    return registerUseCase
}