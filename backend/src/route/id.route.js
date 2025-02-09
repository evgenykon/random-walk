import IdStore from "../store/id.store.js";
import IdModel from "../model/id.model.js";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes (fastify, options) {
    const { redis } = fastify

    fastify.get('/id', async (req, resp) => {
        try {
            const store = new IdStore(redis)
            const idAuth = (req.headers.authorization ?? '').replace(/Bearer /g, '')
            let data = await store.get(idAuth)
            if (!data) {
                data = new IdModel();
                data.lastCoords = null
                data.routes = []
            }
            data.lastConnection = new Date()
            data.lastIp = req.ip
            // await store.set(idAuth, data)

            return resp
                .send({success: true, data})
        } catch (e) {
            return resp
                .send({success: false, error: e.message})
        }
    })

    fastify.delete('/id', async (req, resp) => {
        try {
            const store = new IdStore(redis)
            const idAuth = (req.headers.authorization ?? '').replace(/Bearer /g, '')
            await store.drop(idAuth)

            return resp
                .send({success: true})
        } catch (e) {
            return resp
                .send({success: false, error: e.message})
        }
    })

    fastify.post('/routes', async (req, resp) => {
        try {
            const store = new IdStore(redis)
            const idAuth = (req.headers.authorization ?? '').replace(/Bearer /g, '')
            if (!idAuth) {
                return resp.code(401).send('Invalid header');
            }
            let data = await store.get(idAuth)
            if (!data) {
                data = new IdModel();
                data.lastCoords = null
            }
            data.lastConnection = new Date()
            data.lastIp = req.ip
            data.routes = req.body?.routes ?? []
            await store.set(idAuth, data)

            return resp
                .send({success: true})
        } catch (e) {
            return resp
                .send({success: false, error: e.message})
        }
    })
}

export default routes;
