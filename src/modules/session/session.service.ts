import { omit } from 'lodash'
import { signJwt } from '../../utils/jwt'
import prisma, { User } from '../../utils/prisma'
import { privateFields } from '../user/user.dto'

// TODO: Fix this later

export async function createSession({ userId }: { userId: string }) {
  return await prisma.session.create({ data: { userId: userId } })
}

export async function findSessionById({ sessionId }: { sessionId: string }) {
  return await prisma.session.findUnique({ where: { id: sessionId }, include: { user: true } })
}

export async function invalidateSessionByUserId({ userId }: { userId: string }) {
  // TODO: is this method performant? since we are getting the latest session and then updating it

  const session = await prisma.session.findFirst({
    include: { user: true },
    where: { userId: userId, valid: true },
    orderBy: { createdAt: 'desc' }
  })

  if (!session) {
    return null
  }

  await prisma.session.update({
    where: { id: session.id },
    data: { valid: false }
  })

  return session
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({
    userId
  })

  const refreshToken = signJwt(
    {
      sessionId: session.id
    },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y'
    }
  )

  return refreshToken
}

export function signAccessToken(user: User) {
  const payload = omit(user, privateFields)

  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '60m'
  })

  return accessToken
}
