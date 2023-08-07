import prisma from '../../utils/prisma'
import { OrderCreateInput } from './order.dto'

export async function createOrder({ input }: { input: OrderCreateInput }) {
  const { message, email, phone, fullName, companyName, country, features } = input

  try {
    // check if the features exist
    const featuresExist = await prisma.feature.findMany({
      where: {
        id: {
          in: features
        }
      },
      select: {
        id: true
      }
    })

    if (featuresExist.length !== features.length) {
      throw new Error('features not found')
    }

    let oldAnonymUser = await prisma.anonymUser.findFirst({
      where: {
        email
      }
    })

    if (!oldAnonymUser) {
      oldAnonymUser = await prisma.anonymUser.create({
        data: {
          email,
          phone,
          fullName,
          companyName,
          country
        }
      })
    } else {
      oldAnonymUser = await prisma.anonymUser.update({
        where: {
          id: oldAnonymUser.id
        },
        data: {
          phone,
          fullName,
          companyName,
          country
        }
      })
    }

    const order = await prisma.order.create({
      data: {
        message,
        features: {
          connect: features.map(featureId => ({ id: featureId }))
        },
        anonymUser: {
          connect: {
            id: oldAnonymUser.id
          }
        }
      },
      select: {
        id: true
      }
    })

    const createdOrder = await prisma.order.findFirst({
      where: {
        id: order.id
      },
      include: {
        anonymUser: true,
        features: true
      }
    })

    if (!createdOrder) {
      throw new Error('order create failed')
    }

    return createdOrder
  } catch (error) {
    throw new Error('order create failed')
  }
}
