import argon2 from 'argon2'
import prisma from '../../utils/prisma'
import { RegisterUserInput } from './user.dto'

export async function createUser(input: RegisterUserInput) {
  // hash the password
  const password = await argon2.hash(input.password)

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username: input.username }, { email: input.email }]
    }
  })

  if (user) {
    throw new Error('User already exists')
  }

  // insert the user
  return prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      username: input.username.toLowerCase(),
      password,
      firstName: input.firstName,
      lastName: input.lastName
    }
  })
}

export async function findUserByEmailOrUsername({ usernameOrEmail }: { usernameOrEmail: string }) {
  return prisma.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }
  })
}

export async function findUserByEmail({ email }: { email: string }) {
  return prisma.user.findUnique({
    where: {
      email
    }
  })
}

export async function verifyPassword({ password, candidatePassword }: { password: string; candidatePassword: string }) {
  return argon2.verify(password, candidatePassword)
}

export async function findUsers() {
  return prisma.user.findMany()
}

export async function findUserById({ userId }: { userId: string }) {
  return prisma.user.findFirst({
    where: {
      id: userId
    }
  })
}

export async function verifyUserService({ id }: { id: string }) {
  // console.log('1111 :>> ', 1111);
  // const user = await prisma.user.findUniqueOrThrow({ where: { id: id } })
  // console.log('2222 :>> ', 2222);

  // user.verified = true
  // console.log('3333 :>> ', 3333);

  // console.log('user.fullName :>> ', user.fullName);
  // console.log('4444 :>> ', 4444);

  // await user.save()
  // console.log('5555 :>> ', 5555);

  // return user

  return prisma.user.update({
    where: {
      id
    },
    data: {
      verified: true
    }
  })
}

export async function setPasswordResetCode({ id, code }: { id: string; code: string }) {
  return prisma.user.update({
    where: {
      id
    },
    data: {
      passwordResetCode: code
    }
  })
}

export async function resetPasswordResetCode({ id, password }: { id: string; password: string }) {
  const hash = await argon2.hash(password)

  return prisma.user.update({
    where: {
      id
    },
    data: {
      passwordResetCode: null,
      password: hash
    }
  })
}
