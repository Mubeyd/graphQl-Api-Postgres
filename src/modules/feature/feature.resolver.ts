import { ApolloError } from 'apollo-server-core'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Context } from '../../utils/createServer'
import { GetByIdInput, PaginationInput, SearchByTextInput } from '../common/common.dto'
import {
  FeatureCreateInput,
  FeatureDto,
  FeatureResponseDto,
  FeatureUpdateInput,
  GetFeatureByTagInput,
  GetFeatureByTagsInput
} from './feature.dto'
import {
  createFeature,
  findFeatureById,
  findFeatureByIdDash,
  findFeatures,
  findFeaturesByTagId,
  findFeaturesByTagIds,
  searchFeatureByName,
  updateFeature
} from './feature.service'

// temp auth disabled
@Resolver(() => FeatureDto)
class FeatureResolver {
  // @Authorized()
  @Mutation(() => FeatureResponseDto)
  async createFeature(@Arg('input') input: FeatureCreateInput) {
    try {
      const feature = await createFeature({ input })

      return feature
    } catch (e: any) {
      throw new ApolloError('Error occurred while creating feature')
    }
  }

  // @Authorized()
  @Mutation(() => FeatureResponseDto)
  async updateFeature(@Arg('input') input: FeatureUpdateInput, @Ctx() context: Context) {
    try {
      const feature = await updateFeature({ input: input })

      return feature
    } catch (e: any) {
      throw new ApolloError('Error occurred while updating feature')
    }
  }

  // @Authorized()
  @Query(() => FeatureResponseDto)
  async getFeatureByIdDash(@Arg('input') input: GetByIdInput, @Ctx() context: Context) {
    const feature = await findFeatureByIdDash({  input })

    if (!feature) {
      throw new ApolloError('Could not find feature')
    }

    return feature
  }

  @Query(() => FeatureDto)
  async getFeatureById(@Arg('input') input: GetByIdInput, @Ctx() context: Context) {
    const feature = await findFeatureById({ input })

    if (!feature) {
      throw new ApolloError('Could not find feature')
    }

    return feature
  }

  // for admin panel & public api
  @Query(() => [FeatureDto])
  async getFeatures(@Arg('input') paginationInput: PaginationInput) {
    try {
      const features = await findFeatures({ paginationInput })

      return features
    } catch (e: any) {
      throw new ApolloError('Error occurred while getting features')
    }
  }

  // for admin panel & public api
  @Query(() => [FeatureDto])
  async searchFeatureByName(@Arg('input') input: SearchByTextInput) {
    const feature = await searchFeatureByName({ input })

    if (!feature) {
      throw new ApolloError('Could not find feature')
    }

    return feature
  }

  @Query(() => [FeatureDto])
  async getFeaturesByTagId(@Arg('input') input: GetFeatureByTagInput, @Ctx() context: Context) {
    try {
      const features = await findFeaturesByTagId({ input: input })

      console.log(features)

      return features
    } catch (e: any) {
      throw new ApolloError('Error occurred while getting features')
    }
  }

  @Query(() => [FeatureDto])
  async getFeaturesByTagIds(@Arg('input') input: GetFeatureByTagsInput, @Ctx() context: Context) {
    try {
      const features = await findFeaturesByTagIds({ input })

      return features
    } catch (e: any) {
      throw new ApolloError('Error occurred while getting features')
    }
  }
}

export default FeatureResolver
