import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/authOptions'
import { logConsentChange, revokeConsent, checkConsent, ConsentType } from '@/lib/db/consentLog'
import { logGdprEvent } from '@/lib/utils/auditLog'
import { checkPermission } from '@/lib/auth/permissions'
import { Resource, Action } from '@/lib/auth/permissions'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { consentType, action, scope, metadata } = await req.json()

    // Validate consent type
    if (!Object.values(ConsentType).includes(consentType)) {
      return NextResponse.json({ error: 'Invalid consent type' }, { status: 400 })
    }

    // Check permissions
    checkPermission(session.user, Resource.CONSENT, Action.UPDATE)

    if (action === 'GRANT') {
      await logConsentChange(
        session.user.id,
        consentType,
        'GRANTED',
        scope,
        metadata
      )
      
      await logGdprEvent(
        session.user.id,
        Action.UPDATE,
        `Consent granted for ${consentType}`,
        { scope, metadata }
      )
    } else if (action === 'REVOKE') {
      await revokeConsent(session.user.id, consentType, scope)
      
      await logGdprEvent(
        session.user.id,
        Action.UPDATE,
        `Consent revoked for ${consentType}`,
        { scope }
      )
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Consent API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const consentType = searchParams.get('type') as ConsentType
    const scope = searchParams.get('scope')

    if (consentType && scope) {
      const hasConsent = await checkConsent(session.user.id, consentType, scope)
      return NextResponse.json({ hasConsent })
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  } catch (error) {
    console.error('Consent check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 