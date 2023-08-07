import Decimal from 'decimal.js'
import { Field, Float, ID, InputType, ObjectType } from 'type-graphql'
import { Locale, TxSchemaDto, TxSchemaInput } from '../common/common.dto'

@ObjectType()
export class FeatureDto {
  @Field(() => ID, { nullable: false })
  id: string

  @Field({ nullable: false })
  name: string

  @Field({ nullable: false })
  description: string

  @Field(() => Float, { nullable: false })
  price: Decimal

  @Field({ nullable: false })
  isActive: boolean

  @Field(() => [String], { nullable: true })
  tags: string[]
}

@ObjectType()
export class FeatureResponseDto {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => TxSchemaDto, { nullable: false })
  nameTxJson: TxSchemaDto

  @Field(() => TxSchemaDto, { nullable: false })
  descriptionTxJson: TxSchemaDto

  @Field(() => Float, { nullable: false })
  price: Decimal

  @Field({ nullable: false })
  isActive: boolean

  @Field({ nullable: true })
  imagePath: string
}

@InputType()
export class FeatureCreateInput {
  @Field(() => Float, { nullable: false })
  price: Decimal

  @Field(() => String, { nullable: true })
  imagePath: string

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive: boolean

  @Field(() => TxSchemaInput, { nullable: false })
  nameTxJson: TxSchemaInput

  @Field(() => TxSchemaInput, { nullable: false })
  descriptionTxJson: TxSchemaInput

  @Field(() => [String], { nullable: true })
  tags: string[]
}

@InputType()
export class FeatureUpdateInput {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => Float, { nullable: false })
  price: Decimal

  @Field()
  isActive: boolean

  @Field(() => String, { nullable: true })
  imagePath: string

  @Field(() => TxSchemaInput, { nullable: false })
  nameTxJson: TxSchemaInput

  @Field(() => TxSchemaInput, { nullable: false })
  descriptionTxJson: TxSchemaInput

  @Field(() => [String], { nullable: true })
  tags: string[]

  @Field(() => String, { nullable: false })
  locale: Locale
}

@InputType()
export class GetFeatureByTagInput {
  @Field({ nullable: false })
  tagId: string

  @Field(() => String, { nullable: false })
  locale: Locale
}

@InputType()
export class GetFeatureByTagsInput {
  @Field(() => [String], { nullable: false })
  tagIds: string[]

  @Field(() => String, { nullable: false })
  locale: Locale
}
