import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Locale } from '../common/common.dto'
import { IsEmail } from 'class-validator'

@ObjectType()
export class OrderDto {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => [String], { nullable: true })
  features: string[]
}

@ObjectType()
export class OrderResponse {
  @Field(() => ID, { nullable: false })
  id: string
}

@InputType()
export class OrderCreateInput {
  @Field(() => String, { nullable: false })
  message: string

  @Field(() => String, { nullable: false })
  @IsEmail()
  email: string

  @Field(() => String, { nullable: false })
  fullName: string

  @Field(() => String, { nullable: true })
  phone: string

  @Field(() => String, { nullable: true })
  companyName: string

  @Field(() => String, { nullable: true })
  country: string

  @Field(() => [String], { nullable: true })
  features: string[]

  @Field(() => String, { nullable: false })
  locale: Locale
}
