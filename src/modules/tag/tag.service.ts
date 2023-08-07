import prisma, { Prisma } from '../../utils/prisma'
import { GetByIdInput, PaginationInput, SearchByTextInput } from '../common/common.dto'
import { TagCreateInput, TagUpdateInput } from './tag.dto'

export async function createTag({ input }: { input: TagCreateInput }) {
  const { nameTxJson, descriptionTxJson, imagePath, isActive, locale } = input

  try {
    const tag = await prisma.tag.create({
      data: {
        nameTxJson: nameTxJson,
        descriptionTxJson: descriptionTxJson,
        imagePath: imagePath,
        isActive: isActive
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true,
        isActive: true
      }
    })

    return tag
  } catch (error) {}
}

export async function updateTag({ input }: { input: TagUpdateInput }) {
  //
  try {
    let tag
    tag = await prisma.tag.findFirst({
      where: {
        id: input.id
      }
    })

    if (!tag) {
      throw new Error('Tag not found')
    }

    tag = await prisma.tag.update({
      where: {
        id: input.id
      },
      data: {
        nameTxJson: input.nameTxJson,
        descriptionTxJson: input.descriptionTxJson,
        isActive: input.isActive,
        imagePath: input.imagePath
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        isActive: true,
        imagePath: true
      }
    })

    return tag
  } catch (error) {}
}

export async function findTagByIdDash({ tagId }: { tagId: string }) {
  // for admin panel
  try {
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!tag) {
      throw new Error('Tag not found')
    }

    return tag
  } catch (error) {
    throw new Error('Error findTagById')
  }
}

export async function findTagById({ input }: { input: GetByIdInput }) {
  // for public api

  const { locale, id: tagId } = input
  try {
    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId
      },
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true
      }
    })

    if (!tag) {
      throw new Error('Tag not found')
    }

    const results = {
      id: tag.id,
      name: (tag.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
      description: (tag.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
      imagePath: tag.imagePath
    }

    return results
  } catch (error) {
    throw new Error('Error findTagById')
  }
}

export async function findTags({ paginationInput }: { paginationInput: PaginationInput }) {
  const { locale, page, take } = paginationInput

  const skip = (page - 1) * take

  try {
    const tags = await prisma.tag.findMany({
      skip,
      take,
      select: {
        id: true,
        nameTxJson: true,
        descriptionTxJson: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    const results = tags.map(tag => {
      return {
        id: tag.id,
        name: (tag.nameTxJson as Prisma.JsonObject)?.[locale] ?? '',
        description: (tag.descriptionTxJson as Prisma.JsonObject)?.[locale] ?? '',
        imagePath: tag.imagePath,
        isActive: tag.isActive,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt
      }
    })

    return results
  } catch (error) {
    throw new Error('Error findAllTags')
  }
}

export async function searchTagByName({ input }: { input: SearchByTextInput }) {
  // for public api & admin panel

  const { locale, text } = input

  const take = 10

  try {
    const tags = await prisma.tag.findMany({
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

    const results = tags.map(tag => {
      return {
        id: tag.id,
        name: (tag.nameTxJson as Prisma.JsonObject)?.[locale] as string,
        description: (tag.descriptionTxJson as Prisma.JsonObject)?.[locale] as string, // I guess description is not required for search result
        imagePath: tag.imagePath
      }
    })
    return results
  } catch (error) {
    throw new Error('Error searchTagByNameTxJson')
  }
}
