import Fastify from 'fastify'
import redis from '@fastify/redis'

import idRoute from './src/route/id.route.js'

const fastify = Fastify({
    logger: true
})

fastify.register(redis, {host: 'redis'})

fastify.register(idRoute)

// Run the server!
fastify.listen({ port: 8081, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})