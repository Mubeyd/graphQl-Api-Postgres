import { IsEmail, Length } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => ID, { nullable: false })
  username: string

  @Field(() => ID, { nullable: false })
  email: string

  password: string
}

@InputType()
export class RegisterUserInput {
  @Field({
    nullable: false
  })
  username: string

  @Field()
  @IsEmail()
  email: string

  @Field({
    nullable: false
  })
  firstName: string

  @Field({
    nullable: false
  })
  lastName: string

  @Field()
  @Length(6, 56)
  password: string

  @Field()
  @Length(6, 56)
  passwordConfirmation: string
}

@InputType()
export class LoginInput {
  @Field({
    nullable: false
  })
  usernameOrEmail: string

  @Field()
  @Length(6, 56)
  password: string
}

@InputType()
export class VerifyUserInput {
  @Field({ nullable: false })
  userId: string

  @Field({ nullable: false })
  verificationCode: string
}

@InputType()
export class ForgotPasswordInput {
  @Field({ nullable: false })
  email: string
}

@InputType()
export class ResetPasswordInput {
  @Field({ nullable: false })
  userId: string

  @Field({ nullable: false })
  passwordResetCode: string

  @Field({ nullable: false })
  password: string

  @Field({ nullable: false })
  passwordConfirmation: string
}

export const privateFields = ['password', '__v', 'verificationCode', 'passwordResetCode', 'verified']
