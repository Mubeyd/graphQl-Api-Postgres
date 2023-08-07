// import { Category, Prisma, PrismaClient, Product, Session, User } from '@prisma-client-generated-types' // this is a custom type
import { Category, Prisma, PrismaClient, Product, Session, TranslationModelType, User } from '@prisma/client'
import { preventDeleteActionExtension, totalQueriesExtension, userExtension } from './prismaExtensions'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

export default prisma
  // .$extends(productExtension())
  // .$extends(categoryExtension())
  .$extends(totalQueriesExtension())
  .$extends(userExtension())
  .$extends(preventDeleteActionExtension())
// .$extends(queryPerformanceExtension())

export { User, Session, Category, Product, TranslationModelType, Prisma }

const userPersonalData = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    createdAt: true,
    updatedAt: true
  }
})

export type UserPersonalData = Prisma.UserGetPayload<typeof userPersonalData>

const productWithRelations = Prisma.validator<Prisma.ProductArgs>()({
  include: { category: true, createdByUser: true, updatedByUser: true }
})

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>

const orderWithRelations = Prisma.validator<Prisma.OrderArgs>()({
  include: { features: true, anonymUser: true }
})

export type OrderWithRelations = Prisma.OrderGetPayload<typeof orderWithRelations>

//
//
// some future types that might be useful
//
// Another approach for getting the type of a partial structure (not recommended)

// 1. Function definition that returns a partial structure
async function getUsersWithSessions() {
  const users = await prisma.user.findMany({ include: { sessions: true } })
  return users
}

// Extract `UsersWithSessions` type with
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
type UsersWithSessions = ThenArg<ReturnType<typeof getUsersWithSessions>>

// run inside `async` function
// const usersWithSessions: UsersWithSessions = await getUsersWithSessions()

// 2. Function definition that returns a partial structure with Prisma return type (recommended)
//   import { Prisma } from '@prisma/client'

type UsersWithSessions2 = Prisma.PromiseReturnType<typeof getUsersWithSessions>

// write custom rule for eslint to check for `new PrismaClient` in the code to be not allowed more than once
