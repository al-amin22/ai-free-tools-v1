export type UserTier = 'anonymous' | 'free' | 'premium' | 'business' | 'admin';

export interface User {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  tier: UserTier;
  tierExpiresAt?: string;
  createdAt: string;
}

export interface UserLimits {
  generationsPerHour: number;
  generationsPerDay: number;
  exportsPerDay: number;
  savedDocuments: number;
  workspaces: number;
  watermarkFree: boolean;
  apiAccess: boolean;
  apiCallsPerDay: number;
}

export const TIER_LIMITS: Record<UserTier, UserLimits> = {
  anonymous: {
    generationsPerHour: 10,
    generationsPerDay: 50,
    exportsPerDay: 5,
    savedDocuments: 0,
    workspaces: 0,
    watermarkFree: false,
    apiAccess: false,
    apiCallsPerDay: 0,
  },
  free: {
    generationsPerHour: 20,
    generationsPerDay: 50,
    exportsPerDay: 20,
    savedDocuments: 50,
    workspaces: 1,
    watermarkFree: false,
    apiAccess: false,
    apiCallsPerDay: 0,
  },
  premium: {
    generationsPerHour: -1,
    generationsPerDay: -1,
    exportsPerDay: -1,
    savedDocuments: -1,
    workspaces: 5,
    watermarkFree: true,
    apiAccess: true,
    apiCallsPerDay: 100,
  },
  business: {
    generationsPerHour: -1,
    generationsPerDay: -1,
    exportsPerDay: -1,
    savedDocuments: -1,
    workspaces: -1,
    watermarkFree: true,
    apiAccess: true,
    apiCallsPerDay: 1000,
  },
  admin: {
    generationsPerHour: -1,
    generationsPerDay: -1,
    exportsPerDay: -1,
    savedDocuments: -1,
    workspaces: -1,
    watermarkFree: true,
    apiAccess: true,
    apiCallsPerDay: -1,
  },
};
