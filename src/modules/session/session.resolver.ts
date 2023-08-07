import { ApolloError } from 'apollo-server-core'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../../utils/createServer'
import { verifyJwt } from '../../utils/jwt'
import { findUserByEmailOrUsername, findUserById, verifyPassword } from '../user/user.service'
import { CreateSessionInput, LoginReturn, LogoutReturn, RefreshReturn, Session } from './session.dto'
import { findSessionById, invalidateSessionByUserId, signRefreshToken } from './session.service'

@Resolver(() => Session)
class SessionResolver {
  @Mutation(() => LoginReturn)
  async login(@Arg('input') input: CreateSessionInput, @Ctx() context: Context) {
    const { usernameOrEmail, password } = input

    const message = 'Invalid email or password'

    const user = await findUserByEmailOrUsername({ usernameOrEmail: usernameOrEmail.toLowerCase() })

    if (!user) {
      throw new ApolloError(message)
    }

    if (!user.verified) {
      throw new ApolloError('Please verify your email')
    }

    const isValid = await verifyPassword({ password: user.password, candidatePassword: password })

    if (!isValid) {
      throw new ApolloError(message)
    }

    // sign a access token
    // const accessToken = signAccessToken(user)

    const accessToken = await context.reply?.jwtSign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      { expiresIn: '48h' } // 2 days
    )

    if (!accessToken) {
      throw new ApolloError('Error signing token')
    }

    // sign a refresh token
    const refreshToken = await signRefreshToken({ userId: user.id })

    if (!refreshToken) {
      throw new ApolloError('Error signing token')
    }

    context.reply?.setCookie('accessToken', accessToken, {
      domain: 'localhost',
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 60 * 60 * 24 * 2 // 2 days
    })

    context.reply?.setCookie('refreshToken', refreshToken, {
      domain: 'localhost',
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })

    return {
      accessToken,
      refreshToken
    }
  }

  @Query(() => LogoutReturn)
  async logout(@Ctx() context: Context) {
    const session = await invalidateSessionByUserId({ userId: context.user?.id ?? '' })

    if (!session) throw new ApolloError('ALREADY_LOGGED_OUT')

    context.reply?.setCookie('accessToken', '', {
      domain: 'localhost',
      maxAge: 0,
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false
    })

    context.reply?.setCookie('refreshToken', '', {
      domain: 'localhost',
      maxAge: 0,
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false
    })

    return {
      accessToken: '',
      refreshToken: ''
    }
  }

  @Query(() => RefreshReturn)
  async refresh(@Ctx() context: Context) {
    const refreshToken = context.request?.cookies.refreshToken

    if (!refreshToken) throw new ApolloError('ALREADY_LOGGED_OUT')

    const decoded = verifyJwt<{ sessionId: string }>(refreshToken, 'refreshTokenPublicKey')

    if (!decoded) throw new ApolloError('Could not refresh access token')

    const session = await findSessionById({ sessionId: decoded.sessionId })

    if (!session || !session.valid) {
      throw new ApolloError('Could not refresh access token')
    }

    const user = await findUserById({ userId: session.user.id })

    if (!user) {
      throw new ApolloError('Could not refresh access token')
    }

    const accessToken = await context.reply?.jwtSign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      { expiresIn: '48h' } // 2 days
    )

    if (!accessToken) {
      throw new ApolloError('Error signing token')
    }

    context.reply?.setCookie('accessToken', accessToken, {
      domain: 'localhost',
      path: '/',
      secure: false,
      httpOnly: true,
      sameSite: false,
      maxAge: 60 * 60 * 24 * 2 // 2 days
    })

    return {
      accessToken: accessToken
    }
  }
}

export default SessionResolver
