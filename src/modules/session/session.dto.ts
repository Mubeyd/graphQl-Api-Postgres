import { IsEmail, Length } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'

@ObjectType()
export class Session {
  @Field(() => ID, { nullable: false })
  id: string

  @Field(() => ID, { nullable: false })
  username: string

  @Field(() => ID, { nullable: false })
  email: string

  password: string
}

@InputType()
export class CreateSessionInput {
  @Field()
  @IsEmail()
  usernameOrEmail: string

  @Field()
  @Length(6, 56)
  password: string
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

@ObjectType()
export class LoginReturn {
  @Field({ nullable: false })
  accessToken: string

  @Field({ nullable: false })
  refreshToken: string
}

@ObjectType()
export class LogoutReturn {
  @Field({ nullable: false })
  accessToken: string

  @Field({ nullable: false })
  refreshToken: string
}

@ObjectType()
export class RefreshReturn {
  @Field({ nullable: false })
  accessToken: string
}
