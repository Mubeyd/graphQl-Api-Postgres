import { ApolloError } from 'apollo-server-core'
import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import { GetByIdInput, PaginationInput, SearchByTextInput } from '../common/common.dto'
import { TagCreateInput, TagDto, TagResponseDto, TagUpdateInput } from './tag.dto'
import { createTag, findTagById, findTagByIdDash, findTags, searchTagByName, updateTag } from './tag.service'

@Resolver(() => TagDto)
class TagResolver {
  // @Authorized()
  @Mutation(() => TagResponseDto)
  async createTag(@Arg('input') input: TagCreateInput) {
    try {
      const tag = await createTag({ input })

      return tag
    } catch (e: any) {
      throw new ApolloError('Error occurred while creating tag')
    }
  }

  // @Authorized()
  @Mutation(() => TagResponseDto)
  async updateTag(@Arg('input') input: TagUpdateInput) {
    try {
      const tag = await updateTag({ input })

      return tag
    } catch (e: any) {
      throw new ApolloError('Error occurred while updating tag')
    }
  }

  // for admin panel
  // @Authorized()
  @Query(() => TagResponseDto)
  async getTagByIdDash(@Arg('input') input: GetByIdInput) {
    const tag = await findTagByIdDash({ tagId: input.id })

    if (!tag) {
      throw new ApolloError('Could not find tag')
    }

    return tag
  }

  // for public
  @Query(() => TagDto)
  async getTagById(@Arg('input') input: GetByIdInput) {
    const tag = await findTagById({ input: input })

    if (!tag) {
      throw new ApolloError('Could not find tag')
    }

    return tag
  }

  // for admin panel & public api
  @Query(() => [TagDto])
  async getTags(@Arg('input') paginationInput: PaginationInput) {
    try {
      const tags = await findTags({ paginationInput: paginationInput })

      return tags
    } catch (e: any) {
      throw new ApolloError('Error occurred while getting tags')
    }
  }

  // for admin panel & public api
  @Query(() => [TagDto])
  async searchTagByName(@Arg('input') input: SearchByTextInput) {
    const tag = await searchTagByName({ input })

    if (!tag) {
      throw new ApolloError('Could not find tag')
    }

    return tag
  }
}

export default TagResolver
