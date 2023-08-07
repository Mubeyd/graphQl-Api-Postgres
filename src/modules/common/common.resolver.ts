import { Arg, Query, Resolver } from 'type-graphql'
import { AvailableLocalResponse, CommonDto, SignUrlToUploadFileInput, SignUrlToUploadFileResponse } from './common.dto'
import { generateUploadURL } from './common.service'

@Resolver(() => CommonDto)
export class CommonResolver {
  @Query(() => [AvailableLocalResponse])
  async availableLocals() {
    const availableLocals = [
      {
        locale: 'en',
        name: 'English'
      },
      {
        locale: 'ar',
        name: 'Arabic'
      },
      {
        locale: 'tr',
        name: 'Turkish'
      }
    ]

    return availableLocals
  }

  // @Authorized() // disabled for development purposes
  @Query(() => SignUrlToUploadFileResponse)
  async signUrlToUploadFile(@Arg('input') input: SignUrlToUploadFileInput) {
    const url = await generateUploadURL({ fileName: input.fileName, model: input.model })

    return { url }
  }
}
