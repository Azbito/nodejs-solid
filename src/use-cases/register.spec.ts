import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        registerUseCase = new RegisterUseCase(usersRepository)
    })

    it('should hash user password upon registration', async () => {
        const registerUserUseCase = new RegisterUseCase({
            async findByEmail(email) {
                return null
            },
            async findById(id) {
                return null
            },
            async create(data) {
                return {
                    id: 'user-1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    created_at: new Date()
                }
            }
        })

        const { user } = await registerUserUseCase.execute({
            name: 'John',
            email: 'john@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('shout not be able to register with same email twice', async () => {
        const email = 'john@example.com'

        await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        await expect(async () =>         
            {
            await registerUseCase.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })}).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})