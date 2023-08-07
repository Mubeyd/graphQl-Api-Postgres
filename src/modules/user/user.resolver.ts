import { ApolloError } from 'apollo-server-core'
import { nanoid } from 'nanoid'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../../utils/createServer'
import log from '../../utils/logger'
import sendEmail from '../../utils/mailer'
import { ForgotPasswordInput, RegisterUserInput, ResetPasswordInput, User, VerifyUserInput } from './user.dto'
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUsers,
  resetPasswordResetCode,
  setPasswordResetCode,
  verifyUserService
} from './user.service'

@Resolver(() => User)
class UserResolver {
  @Mutation(() => User)
  async register(@Arg('input') input: RegisterUserInput) {
    try {
      if (input.password !== input.passwordConfirmation) {
        throw new ApolloError('Passwords do not match')
      }
      const user = await createUser(input)

      await sendEmail({
        to: user.email,
        from: 'info@your-domain.com',
        subject: 'Verify your email',
        text: `verification code: ${user.verificationCode}. Id: ${user.id}`
        // text: `verification code: ${user.verificationCode}.`
      })

      return user
    } catch (e: any) {
      log.error(e)
      if (e.code === 11000) {
        throw new ApolloError('Account already exists')
      }
      // check if violates unique constraint
      throw new ApolloError('Error occurred while creating user')
    }
  }

  @Mutation(() => String)
  async verifyUser(@Arg('input') input: VerifyUserInput) {
    // find the user by id
    const user = await findUserById({ userId: input.userId })

    if (!user) {
      throw new ApolloError('Could not verify user')
    }

    if (user.verified) {
      return 'User is already verified'
    }

    if (user.verificationCode === input.verificationCode) {
      await verifyUserService({ id: user.id })

      // later check if this code can work
      // user.verified = true
      // await user.save()

      return 'User successfully verified'
    }

    return 'Could not verify user'
  }

  @Mutation(() => String)
  async forgotPassword(@Arg('input') input: ForgotPasswordInput) {
    const message = 'If a user with that email is registered you will receive a password reset email'

    const { email } = input

    // find the user by id
    const user = await findUserByEmail({ email: email })

    if (!user) {
      log.debug(`User with email ${email} does not exists`)
      throw new ApolloError('Could not verify user')
    }

    if (!user.verified) {
      return 'User is not verified'
    }

    const passwordResetCode = nanoid()

    await setPasswordResetCode({ id: user.id, code: passwordResetCode })

    await sendEmail({
      to: user.email,
      from: 'test@example.com',
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}. Id ${user.id}`
    })

    log.debug(`Password reset email sent to ${email}`)

    return message
  }

  @Mutation(() => String)
  async passwordReset(@Arg('input') input: ResetPasswordInput) {
    const message = 'Successfully updated password'

    const { userId, passwordResetCode, password, passwordConfirmation } = input

    const user = await findUserById({ userId })

    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return 'Could not reset user password'
    }

    await resetPasswordResetCode({ id: user.id, password: password })

    return message
  }

  @Authorized()
  @Query(() => User)
  me(@Ctx() context: Context) {
    return context.user
  }

  @Query(() => [User])
  async users() {
    return findUsers()
  }
}

export default UserResolver
