import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

export type ConsentType = 
  | 'DATA_PROCESSING'
  | 'THERAPIST_ACCESS'
  | 'ORGANIZATION_SHARING'
  | 'MARKETING'
  | 'RESEARCH'

export type ConsentStatus = 'GRANTED' | 'REVOKED' | 'EXPIRED'

export interface ConsentLogEntry {
  userId: string
  consentType: ConsentType
  status: ConsentStatus
  grantedAt: Date
  expiresAt: Date
  scope: string
  metadata?: Record<string, any>
}

const DEFAULT_EXPIRY_DURATIONS: Record<ConsentType, number> = {
  DATA_PROCESSING: 12 * 30 * 24 * 60 * 60 * 1000, // 12 months
  THERAPIST_ACCESS: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months
  ORGANIZATION_SHARING: 24 * 30 * 24 * 60 * 60 * 1000, // 24 months
  MARKETING: 6 * 30 * 24 * 60 * 60 * 1000, // 6 months
  RESEARCH: 0 // Project duration (handled separately)
}

export async function logConsentChange(
  userId: string,
  consentType: ConsentType,
  status: ConsentStatus,
  scope: string,
  metadata?: Record<string, any>
): Promise<void> {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + DEFAULT_EXPIRY_DURATIONS[consentType])

  await prisma.consentLog.create({
    data: {
      userId,
      consentType,
      status,
      grantedAt: now,
      expiresAt,
      scope,
      metadata: metadata || {}
    }
  })
}

export async function getActiveConsents(userId: string): Promise<ConsentLogEntry[]> {
  const now = new Date()
  
  return prisma.consentLog.findMany({
    where: {
      userId,
      status: 'GRANTED',
      expiresAt: {
        gt: now
      }
    },
    orderBy: {
      grantedAt: 'desc'
    }
  })
}

export async function revokeConsent(
  userId: string,
  consentType: ConsentType,
  scope: string
): Promise<void> {
  const now = new Date()
  
  await prisma.consentLog.updateMany({
    where: {
      userId,
      consentType,
      scope,
      status: 'GRANTED',
      expiresAt: {
        gt: now
      }
    },
    data: {
      status: 'REVOKED',
      expiresAt: now
    }
  })
}

export async function checkConsent(
  userId: string,
  consentType: ConsentType,
  scope: string
): Promise<boolean> {
  const now = new Date()
  
  const activeConsent = await prisma.consentLog.findFirst({
    where: {
      userId,
      consentType,
      scope,
      status: 'GRANTED',
      expiresAt: {
        gt: now
      }
    }
  })

  return !!activeConsent
} 