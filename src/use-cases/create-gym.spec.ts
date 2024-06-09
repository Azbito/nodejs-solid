import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create a gym', async () => {
        const { gym } = await sut.execute({
            title: 'Jim',
            description: null,
            phone: null,
            latitude: -23.894218,
            longitude: -49.785454
        })

        expect(gym.id).toEqual(expect.any(String))
    })

})