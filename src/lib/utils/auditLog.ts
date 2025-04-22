import { prisma } from '../db/prisma'
import { Resource, Action } from '../auth/permissions'

export type AuditEventType = 
  | 'DATA_ACCESS'
  | 'DATA_MODIFICATION'
  | 'CONSENT_CHANGE'
  | 'USER_ACTION'
  | 'SYSTEM_EVENT'

export interface AuditLogEntry {
  userId: string
  eventType: AuditEventType
  resource: Resource
  action: Action
  description: string
  metadata?: Record<string, any>
}

export async function logAuditEvent(
  userId: string,
  eventType: AuditEventType,
  resource: Resource,
  action: Action,
  description: string,
  metadata?: Record<string, any>
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId,
      eventType,
      resource,
      action,
      description,
      metadata: metadata || {},
      timestamp: new Date()
    }
  })
}

export async function getAuditLogs(
  userId?: string,
  resource?: Resource,
  startDate?: Date,
  endDate?: Date
): Promise<AuditLogEntry[]> {
  return prisma.auditLog.findMany({
    where: {
      ...(userId && { userId }),
      ...(resource && { resource }),
      ...(startDate && { timestamp: { gte: startDate } }),
      ...(endDate && { timestamp: { lte: endDate } })
    },
    orderBy: {
      timestamp: 'desc'
    }
  })
}

export async function exportAuditLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<AuditLogEntry[]> {
  return getAuditLogs(userId, undefined, startDate, endDate)
}

// Helper function to log GDPR-related events
export async function logGdprEvent(
  userId: string,
  action: Action,
  description: string,
  metadata?: Record<string, any>
): Promise<void> {
  await logAuditEvent(
    userId,
    'USER_ACTION',
    'GDPR_REQUEST',
    action,
    description,
    metadata
  )
} 