import { Prisma } from '@prisma/client';

export type NotificationCreateData = Omit<Prisma.NotificationCreateInput, 'user'>;
