import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-fastify'
import { ApolloServerPlugin } from 'apollo-server-plugin-base'
import config from 'config'
import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { GraphQLSchema, execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { buildSchema } from 'type-graphql'
import { CommonResolver } from '../modules/common/common.resolver'
import FeatureResolver from '../modules/feature/feature.resolver'
import MessageResolver from '../modules/message/message.resolver'
import OrderResolver from '../modules/order/order.resolver'
import SessionResolver from '../modules/session/session.resolver'
import TagResolver from '../modules/tag/tag.resolver'
import UserResolver from '../modules/user/user.resolver'
import { User } from '../utils/prisma'
import { bearerAuthChecker } from './bearerAuthChecker'

const fastifyInstance = Fastify({
  // logger:
  //   process.env.NODE_ENV === 'development'
  //     ? {
  //         prettyPrint: true
  //       }
  //     : false
})

fastifyInstance.register(fastifyCors, {
  credentials: true,
  origin: (origin, cb) => {
    if (
      !origin ||
      ['http://localhost:3000', 'https://studio.apollographql.com', 'http://0.0.0.0:4000'].includes(origin)
    ) {
      return cb(null, true)
    }

    return cb(new Error('Not allowed'), false)
  }
})


fastifyInstance.register(fastifyCookie, {
  parseOptions: {}
})

fastifyInstance.register(fastifyJwt, {
  secret: {
    private: Buffer.from(config.get<string>('accessTokenPrivateKey'), 'base64').toString('ascii'),
    public: Buffer.from(config.get<string>('accessTokenPublicKey'), 'base64').toString('ascii')
  },
  // secret: 'change-me',
  sign: { algorithm: 'RS256' },
  cookie: {
    cookieName: 'accessToken',
    signed: false
  }
})

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close()
        }
      }
    }
  }
}

type CtxUser = Omit<User, 'password'>

async function buildContext({
  request,
  reply,
  connectionParams
}: {
  request?: FastifyRequest
  reply?: FastifyReply
  connectionParams?: {
    Authorization: string
  }
}) {
  if (connectionParams || !request) {
    try {
      return {
        user: await fastifyInstance.jwt.verify<CtxUser>(connectionParams?.Authorization || '')
      }
    } catch (e) {
      return { user: null }
    }
  }

  // TODO: remove this and get locale from request  body, cause this is a graph api
  // let locale = (request.headers['accepted-language'] as Locale | undefined) ?? 'en'

  try {
    // const lol = reply?.customSignJwt
    const user = await request.jwtVerify<CtxUser>()
    return { request, reply, user }
  } catch (e) {
    return { request, reply, user: null }
  }
}

export type Context = Awaited<ReturnType<typeof buildContext>>

export async function createServer() {
  const schema = await buildSchema({
    resolvers: [
      CommonResolver,
      UserResolver,
      SessionResolver,
      MessageResolver,
      TagResolver,
      FeatureResolver,
      OrderResolver
    ],
    authChecker: bearerAuthChecker
  })

  // activate playground in development mode
  const apolloServerInstance = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(fastifyInstance),
      ApolloServerPluginDrainHttpServer({ httpServer: fastifyInstance.server }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true })
    ],
    context: buildContext,
    introspection: true
  })

  subscriptionServer({ schema, server: fastifyInstance.server })

  return { app: fastifyInstance, server: apolloServerInstance }
}

const subscriptionServer = ({ schema, server }: { schema: GraphQLSchema; server: typeof fastifyInstance.server }) => {
  return SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(connectionParams: { Authorization: string }) {
        return buildContext({ connectionParams })
      }
    },
    {
      server,
      path: '/graphql'
    }
  )
}
