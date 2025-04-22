import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { checkPermission, Resource, Action } from '@/lib/auth/permissions'
import { prisma } from '@/lib/prisma'

export async function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredPermissions?: {
    resource: Resource
    action: Action
    getResourceData?: (req: NextRequest) => Promise<any>
  }
) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({ req })
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        include: {
          therapist: {
            include: {
              clients: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (requiredPermissions) {
        const resourceData = requiredPermissions.getResourceData
          ? await requiredPermissions.getResourceData(req)
          : undefined

        checkPermission(
          user,
          requiredPermissions.resource,
          requiredPermissions.action,
          resourceData
        )
      }

      return handler(req)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export async function withOrganization(
  handler: (req: NextRequest) => Promise<NextResponse>,
  requiredPermissions?: {
    resource: Resource
    action: Action
  }
) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({ req })
      
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        include: {
          organization: true,
          therapist: {
            include: {
              clients: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      if (!user.organizationId) {
        return NextResponse.json(
          { error: 'User is not part of an organization' },
          { status: 403 }
        )
      }

      if (requiredPermissions) {
        checkPermission(
          user,
          requiredPermissions.resource,
          requiredPermissions.action,
          user.organization
        )
      }

      return handler(req)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
} 