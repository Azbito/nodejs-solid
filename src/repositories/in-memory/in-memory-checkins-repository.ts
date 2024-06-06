import { randomUUID } from "crypto";
import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn: CheckIn = {
            id: randomUUID(),
            userId: data.userId,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }
}
