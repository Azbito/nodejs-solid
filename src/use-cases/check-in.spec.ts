import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { InvalidCheckInError } from './errors/checkin-twice'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: "Gabriel's Gym",
            description: '',
            phone: '',
            latitude: new Decimal(-23.894218),
            longitude: new Decimal(-49.785454)
        })
        
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should not be able to check in', async () => {
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.894218,
            userLongitude: -49.785454,
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        const month = 1
        vi.setSystemTime(new Date(2022, month - 1, 20, 8, 0, 0))
        
        try {
            await sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -23.894218,
                userLongitude: -49.785454,
            })
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidCheckInError)
        }
    })

    it('should be able to check in twice but in different days', async () => {
        const month = 1 // 1 = january
    
        vi.setSystemTime(new Date(2022, month - 1, 21, 8, 0, 0))
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -23.894218,
            userLongitude: -49.785454,
        })


        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        const month = 1 // 1 = janeiro
    
        vi.setSystemTime(new Date(2022, month - 1, 21, 8, 0, 0))
        gymsRepository.items.push({
            id: "gym-02",
            title: "Kog'Maw's Gym",
            description: '',
            phone: '',
            latitude: new Decimal(-23.894218), // latitude da nova academia
            longitude: new Decimal(-49.785454) // longitude da nova academia
        })
    
        try {
            await expect(() => {sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -23.894218,
                userLongitude: -49.785454,
            })}).rejects.toBeInstanceOf(InvalidCheckInError);
        } catch (error) {
            console.log(error)      
        }
    })
    
})