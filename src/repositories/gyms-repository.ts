import { CheckIn, Gym, Prisma } from "@prisma/client";

export interface GymsRepository {
    findById(id: string): Promise<Gym | null>
}