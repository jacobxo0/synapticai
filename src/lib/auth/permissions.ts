import { UserRole } from '@prisma/client'

export enum Resource {
  USER = 'user',
  CONVERSATION = 'conversation',
  MOOD_LOG = 'moodLog',
  GOAL = 'goal',
  THERAPIST_NOTE = 'therapistNote',
  ORGANIZATION = 'organization',
  SETTINGS = 'settings',
  GDPR_REQUEST = 'gdprRequest',
  CONSENT = 'consent',
  AUDIT_LOG = 'auditLog'
}

export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
  MANAGE = 'manage',
  EXPORT = 'export',
  REQUEST = 'request',
  APPROVE = 'approve',
  REVOKE = 'revoke'
}

type Permission = {
  resource: Resource
  action: Action
  conditions?: (user: any, resource: any) => boolean
}

const defaultConditions = {
  isOwner: (user: any, resource: any) => user.id === resource.userId,
  isOrganizationMember: (user: any, resource: any) => 
    user.organizationId === resource.organizationId,
  hasConsent: (user: any, resource: any) => 
    resource.consentGiven && resource.consentDate <= new Date(),
  isTherapist: (user: any, resource: any) => 
    user.role === UserRole.THERAPIST && user.therapist?.clients.some(c => c.userId === resource.userId),
  isGdprRequestOwner: (user: any, resource: any) =>
    user.id === resource.requestedBy,
  isConsentOwner: (user: any, resource: any) =>
    user.id === resource.userId
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    { resource: Resource.USER, action: Action.READ, conditions: defaultConditions.isOwner },
    { resource: Resource.USER, action: Action.UPDATE, conditions: defaultConditions.isOwner },
    { resource: Resource.CONVERSATION, action: Action.CREATE },
    { resource: Resource.CONVERSATION, action: Action.READ, conditions: defaultConditions.isOwner },
    { resource: Resource.CONVERSATION, action: Action.UPDATE, conditions: defaultConditions.isOwner },
    { resource: Resource.CONVERSATION, action: Action.DELETE, conditions: defaultConditions.isOwner },
    { resource: Resource.CONVERSATION, action: Action.SHARE, conditions: defaultConditions.isOwner },
    { resource: Resource.MOOD_LOG, action: Action.CREATE },
    { resource: Resource.MOOD_LOG, action: Action.READ, conditions: defaultConditions.isOwner },
    { resource: Resource.MOOD_LOG, action: Action.UPDATE, conditions: defaultConditions.isOwner },
    { resource: Resource.MOOD_LOG, action: Action.DELETE, conditions: defaultConditions.isOwner },
    { resource: Resource.MOOD_LOG, action: Action.SHARE, conditions: defaultConditions.isOwner },
    { resource: Resource.GOAL, action: Action.CREATE },
    { resource: Resource.GOAL, action: Action.READ, conditions: defaultConditions.isOwner },
    { resource: Resource.GOAL, action: Action.UPDATE, conditions: defaultConditions.isOwner },
    { resource: Resource.GOAL, action: Action.DELETE, conditions: defaultConditions.isOwner },
    { resource: Resource.GOAL, action: Action.SHARE, conditions: defaultConditions.isOwner },
    { resource: Resource.SETTINGS, action: Action.READ, conditions: defaultConditions.isOwner },
    { resource: Resource.SETTINGS, action: Action.UPDATE, conditions: defaultConditions.isOwner },
    
    { resource: Resource.GDPR_REQUEST, action: Action.CREATE, conditions: defaultConditions.isOwner },
    { resource: Resource.GDPR_REQUEST, action: Action.READ, conditions: defaultConditions.isGdprRequestOwner },
    { resource: Resource.GDPR_REQUEST, action: Action.EXPORT, conditions: defaultConditions.isGdprRequestOwner },
    { resource: Resource.CONSENT, action: Action.READ, conditions: defaultConditions.isConsentOwner },
    { resource: Resource.CONSENT, action: Action.UPDATE, conditions: defaultConditions.isConsentOwner },
    { resource: Resource.CONSENT, action: Action.REVOKE, conditions: defaultConditions.isConsentOwner }
  ],

  [UserRole.THERAPIST]: [
    ...rolePermissions[UserRole.USER],
    { resource: Resource.CONVERSATION, action: Action.READ, conditions: defaultConditions.isTherapist },
    { resource: Resource.MOOD_LOG, action: Action.READ, conditions: defaultConditions.isTherapist },
    { resource: Resource.GOAL, action: Action.READ, conditions: defaultConditions.isTherapist },
    { resource: Resource.THERAPIST_NOTE, action: Action.CREATE },
    { resource: Resource.THERAPIST_NOTE, action: Action.READ, conditions: defaultConditions.isTherapist },
    { resource: Resource.THERAPIST_NOTE, action: Action.UPDATE, conditions: defaultConditions.isTherapist },
    { resource: Resource.THERAPIST_NOTE, action: Action.DELETE, conditions: defaultConditions.isTherapist },
    
    { resource: Resource.CONSENT, action: Action.READ, conditions: defaultConditions.isTherapist },
    { resource: Resource.CONSENT, action: Action.REQUEST, conditions: defaultConditions.isTherapist }
  ],

  [UserRole.ORG_ADMIN]: [
    ...rolePermissions[UserRole.THERAPIST],
    { resource: Resource.ORGANIZATION, action: Action.READ, conditions: defaultConditions.isOrganizationMember },
    { resource: Resource.ORGANIZATION, action: Action.UPDATE, conditions: defaultConditions.isOrganizationMember },
    { resource: Resource.USER, action: Action.MANAGE, conditions: defaultConditions.isOrganizationMember },
    { resource: Resource.SETTINGS, action: Action.MANAGE, conditions: defaultConditions.isOrganizationMember },
    
    { resource: Resource.GDPR_REQUEST, action: Action.APPROVE, conditions: defaultConditions.isOrganizationMember },
    { resource: Resource.AUDIT_LOG, action: Action.READ, conditions: defaultConditions.isOrganizationMember }
  ],

  [UserRole.SUPPORT]: [
    { resource: Resource.USER, action: Action.READ },
    { resource: Resource.USER, action: Action.UPDATE },
    { resource: Resource.ORGANIZATION, action: Action.READ },
    { resource: Resource.ORGANIZATION, action: Action.UPDATE },
    { resource: Resource.SETTINGS, action: Action.MANAGE },
    
    { resource: Resource.GDPR_REQUEST, action: Action.READ },
    { resource: Resource.GDPR_REQUEST, action: Action.APPROVE },
    { resource: Resource.AUDIT_LOG, action: Action.READ },
    { resource: Resource.AUDIT_LOG, action: Action.MANAGE }
  ]
}

export function hasPermission(
  user: any,
  resource: Resource,
  action: Action,
  resourceData?: any
): boolean {
  const permissions = rolePermissions[user.role as UserRole] || []
  
  return permissions.some(permission => {
    if (permission.resource !== resource || permission.action !== action) {
      return false
    }

    if (!permission.conditions) {
      return true
    }

    return permission.conditions(user, resourceData)
  })
}

export function checkPermission(
  user: any,
  resource: Resource,
  action: Action,
  resourceData?: any
): void {
  if (!hasPermission(user, resource, action, resourceData)) {
    throw new Error(`User ${user.id} does not have permission to ${action} ${resource}`)
  }
} 