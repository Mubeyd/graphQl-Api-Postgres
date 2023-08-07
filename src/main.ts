require('dotenv').config() // the order if this is important! -- should be the first thing to be imported
import config from 'config'
import 'reflect-metadata'
import { createServer } from './utils/createServer'
import log from './utils/logger'

const port = config.get<number>('port')
const host = config.get<string>('host')

async function main() {
  const { app, server } = await createServer()

  app.get('/healthcheck', async () => 'OK')

  await server.start()

  app.register(
    server.createHandler({
      cors: false
    })
  )

  await app.listen({
    port: port,
    host: host
  })

  log.info(`Server ready at http://${host}:${port}${server.graphqlPath}`)
}

;['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    await (await createServer()).app.close()

    process.exit(0)
  })
})

main()
