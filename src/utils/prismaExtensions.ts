import log from './logger'
import prisma, { Prisma } from './prisma'

export function productExtension() {
  return Prisma.defineExtension({
    name: `productExtension`,
    model: {
      product: {
        async saveUser({ modelId, userId }: { modelId: string; userId: string }) {
          await prisma.product.update({ where: { id: modelId }, data: { createdByUserId: userId } })
        },
        async updateUser({ modelId, userId }: { modelId: string; userId: string }) {
          await prisma.product.update({ where: { id: modelId }, data: { updatedByUserId: userId } })
        }
      }
    }
  })
}

export function categoryExtension() {
  return Prisma.defineExtension({
    name: `categoryExtension`,
    model: {
      category: {
        async saveUser({ modelId, userId }: { modelId: string; userId: string }) {
          await prisma.category.update({ where: { id: modelId }, data: { createdByUserId: userId } })
        },
        async updateUser({ modelId, userId }: { modelId: string; userId: string }) {
          await prisma.category.update({ where: { id: modelId }, data: { updatedByUserId: userId } })
        }
      }
    }
  })
}

export function allModelsExtension() {
  return Prisma.defineExtension({
    name: `allModelsExtension`,
    model: {
      $allModels: {
        async validate() {
          const ctx = Prisma.getExtensionContext(this)
          log.info('ctx.name :>> ', ctx.name)
          log.info('ctx :>> ', ctx)
        }
      }
    }
  })
}

export function totalQueriesExtension() {
  return Prisma.defineExtension({
    name: `totalQueriesExtension`,
    client: {
      $log: (s: string) => log.info(s),
      async $totalQueries() {
        const index_prisma_client_queries_total = 0
        const ctx = Prisma.getExtensionContext(this)
        const metricsCounters = (await Prisma.getExtensionContext(this).$metrics.json()).counters

        return { count: metricsCounters[index_prisma_client_queries_total].value, clientInstance: ctx.name }
      }
    }
  })
}

export function userExtension() {
  return Prisma.defineExtension({
    name: `userExtension`,
    result: {
      user: {
        fullName: {
          needs: { firstName: true, lastName: true },
          compute(user) {
            return `${user.firstName} ${user.lastName}`
          }
        },
        save: {
          needs: { id: true },
          compute(user) {
            return () => prisma.user.update({ where: { id: user.id }, data: user })
          }
        }
      }
    }
  })
}

export function preventDeleteActionExtension() {
  return Prisma.defineExtension({
    name: `preventDeleteActionExtension`,
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          if (operation === 'delete') {
            throw new Error(`You can't delete ${model} with id ${(args as any).where.id}`)
          }

          return query(args)
        }
      }
    }
  })
}

export function queryPerformanceExtension() {
  return Prisma.defineExtension({
    name: `queryPerformanceExtension`,
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const before = Date.now()

          const results = await query(args)

          const after = Date.now()

          log.info(`Query ${model}.${operation} took ${after - before}ms`)

          return results
        }
      }
    }
  })
}
