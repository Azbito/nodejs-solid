import { expect, describe, it, vi, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { InvalidCheckInError } from './errors/checkin-twice'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInsRepository)
    })

    it('should not be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
        })
        
        await expect(() => {
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
            })
        }).rejects.toBeInstanceOf(InvalidCheckInError)

    })
})