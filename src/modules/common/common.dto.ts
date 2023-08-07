import { IsInt, Max, Min } from 'class-validator'
import { Field, InputType, ObjectType } from 'type-graphql'

export type Locale = 'en' | 'ar' | 'tr'

@ObjectType()
export class TxSchemaDto {
  @Field(() => String, { nullable: false })
  en: string

  @Field(() => String, { nullable: false })
  ar: string

  @Field(() => String, { nullable: false })
  tr: string;

  [key: string]: string
}

@InputType()
export class TxSchemaInput {
  @Field(() => String, { nullable: false })
  en: string

  @Field(() => String, { nullable: false })
  ar: string

  @Field(() => String, { nullable: false })
  tr: string;

  [key: string]: string
}

@InputType()
export class PaginationInput {
  @Field(() => String, { nullable: false })
  locale: string

  @IsInt()
  @Min(1)
  @Field(() => Number, { nullable: false })
  page: number

  @IsInt()
  @Max(50, { message: 'take must be less than or equal to 50' })
  @Field(() => Number, { nullable: false })
  take: number
}

@InputType()
export class SearchByTextInput {
  @Field({ nullable: false })
  text: string

  @Field({ nullable: false })
  locale: Locale
}

@InputType()
export class GetByIdInput {
  @Field({ nullable: false })
  id: string

  @Field({ nullable: false })
  locale: Locale
}

@ObjectType()
export class CommonDto {
  @Field({ nullable: true })
  key: string;

  [key: string]: Date | string | null | undefined
}

@ObjectType()
export class AvailableLocalResponse {
  @Field({ nullable: false })
  locale: string

  @Field({ nullable: false })
  name: string
}

@ObjectType()
export class SignUrlToUploadFileResponse {
  @Field({ nullable: false })
  url: string
}

@InputType()
export class SignUrlToUploadFileInput {
  @Field({ nullable: false })
  fileName: string

  @Field({ nullable: false })
  model: 'feature' | 'tag'
}
