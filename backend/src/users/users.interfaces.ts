import { Prisma } from '@prisma/client';

export type UserCustomCreateInput = Omit<Prisma.UserCreateInput, 'passwordDigest'> & { password: string };
export type UserCustomUpdateInput = Omit<Prisma.UserUpdateInput, 'passwordDigest'> & { password?: string };
