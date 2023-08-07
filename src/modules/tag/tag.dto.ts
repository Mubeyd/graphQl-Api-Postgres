import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Locale, TxSchemaDto, TxSchemaInput } from '../common/common.dto'

/// Tag

@ObjectType()
export class TagDto {
  @Field(() => ID, { nullable: false })
  id: string

  @Field({ nullable: false })
  name: string

  @Field({ nullable: false })
  description: string

  @Field({ nullable: true })
  imagePath: string
}

@ObjectType()
export class TagResponseDto {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => TxSchemaDto, { nullable: false })
  nameTxJson: TxSchemaDto

  @Field(() => TxSchemaDto, { nullable: false })
  descriptionTxJson: TxSchemaDto

  @Field({ nullable: false })
  isActive: boolean

  @Field({ nullable: true })
  imagePath: string
}

@InputType()
export class TagCreateInput {
  @Field(() => String, { nullable: true })
  imagePath: string

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  isActive: boolean

  @Field(() => TxSchemaInput, { nullable: false })
  nameTxJson: TxSchemaInput

  @Field(() => TxSchemaInput, { nullable: false })
  descriptionTxJson: TxSchemaInput

  @Field(() => String, { nullable: false })
  locale: Locale
}

@InputType()
export class TagUpdateInput {
  @Field(() => ID, { nullable: false })
  id: string

  @Field()
  isActive: boolean

  @Field(() => String, { nullable: true })
  imagePath: string

  @Field(() => TxSchemaInput, { nullable: false })
  nameTxJson: TxSchemaInput

  @Field(() => TxSchemaInput, { nullable: false })
  descriptionTxJson: TxSchemaInput

  @Field(() => String, { nullable: false })
  locale: Locale
}
