import prisma, { Prisma } from '../../utils/prisma'
import { GetByIdInput, PaginationInput, SearchByTextInput } from '../common/common.dto'
import { FeatureCreateInput, FeatureUpdateInput, GetFeatureByTagInput, GetFeatureByTagsInput } from './feature.dto'

export async function createFeature({ input }: { input: FeatureCreateInput }) {
  const { nameTxJson, descriptionTxJson, imagePath, isActive, price, tags } = input

  try {
    const feature = await prisma.feature.create({
      data: {
        nameTxJson: nameTxJson,
        descriptionTxJson: descriptionTxJson,
        imagePath: imagePath,
        isActive: isActive,
        price,
        tags: {
          connect: tags.map(tagId => ({ id: tagId }))
        }
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true,
        isActive: true,
        price: true
      }
    })

    return feature
  } catch (error) {
    throw new Error('feature create failed')
  }
}

export async function updateFeature({ input }: { input: FeatureUpdateInput }) {
  //

  const { tags } = input
  try {
    let feature
    feature = await prisma.feature.findFirst({
      where: {
        id: input.id
      }
    })

    if (!feature) {
      throw new Error('Tag not found')
    }

    feature = await prisma.feature.update({
      where: {
        id: input.id
      },
      data: {
        nameTxJson: input.nameTxJson,
        descriptionTxJson: input.descriptionTxJson,
        isActive: input.isActive,
        imagePath: input.imagePath,
        price: input.price,
        tags: {
          set: tags.map(tagId => ({ id: tagId }))
        }
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        isActive: true,
        imagePath: true,
        price: true
      }
    })

    return feature
  } catch (error) {
    throw new Error('feature update failed')
  }
}

export async function findFeatureByIdDash({ input }: { input: GetByIdInput }) {
  // for admin panel

  const { id, locale } = input
  try {
    const feature = await prisma.feature.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        price: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!feature) {
      throw new Error('Tag not found')
    }

    return feature
  } catch (error) {
    throw new Error('Error findFeatureById')
  }
}

export async function findFeatureById({ input }: { input: GetByIdInput }) {
  // for public api

  const { locale, id } = input
  try {
    const feature = await prisma.feature.findFirst({
      where: {
        id: id
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        price: true,
        imagePath: true
      }
    })

    if (!feature) {
      throw new Error('Tag not found')
    }

    const results = {
      id: feature.id,
      name: (feature.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
      description: (feature.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
      imagePath: feature.imagePath
    }

    return results
  } catch (error) {
    throw new Error('Error findTagById')
  }
}

export async function findFeatures({ paginationInput }: { paginationInput: PaginationInput }) {
  const { locale, page, take } = paginationInput

  const skip = (page - 1) * take

  try {
    const features = await prisma.feature.findMany({
      skip,
      take,
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        price: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const results = features.map(item => {
      return {
        id: item.id,
        name: (item.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
        description: (item.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
        price: item.price,
        imagePath: item.imagePath,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    })

    return results
  } catch (error) {
    throw new Error('Error findAllTags')
  }
}

export async function searchFeatureByName({ input }: { input: SearchByTextInput }) {
  // for public api & admin panel

  const { locale, text } = input

  const take = 10

  try {
    const features = await prisma.feature.findMany({
      where: {
        nameTxJson: {
          path: [locale],
          string_contains: text
        }
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      take
    })

    const results = features.map(item => {
      return {
        id: item.id,
        name: (item.nameTxJson as Prisma.JsonObject)?.[locale] as string,
        description: (item.descriptionTxJson as Prisma.JsonObject)?.[locale] as string, // I guess description is not required for search result
        imagePath: item.imagePath
      }
    })
    return results
  } catch (error) {
    throw new Error('Error searchTagByNameTxJson')
  }
}

export async function findFeaturesByTagId({ input }: { input: GetFeatureByTagInput }) {
  const { locale, tagId } = input
  try {
    const features = await prisma.feature.findMany({
      where: {
        tags: {
          some: {
            id: tagId
          }
        }
      },

      take: 10,
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        price: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const results = features.map(item => {
      return {
        id: item.id,
        name: (item.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
        description: (item.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
        price: item.price,
        imagePath: item.imagePath,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    })

    return results
  } catch (error) {
    throw new Error('Error findFeaturesByTagId')
  }
}

export async function findFeaturesByTagIds({ input }: { input: GetFeatureByTagsInput }) {
  const { locale, tagIds } = input
  try {
    const features = await prisma.feature.findMany({
      where: {
        tags: {
          some: {
            id: {
              in: tagIds
            }
          }
        }
      },

      take: 10,
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        price: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const results = features.map(item => {
      return {
        id: item.id,
        name: (item.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
        description: (item.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
        price: item.price,
        imagePath: item.imagePath,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }
    })

    return results
  } catch (error) {
    throw new Error('Error findFeaturesByTagIds')
  }
}
