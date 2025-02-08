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
            let id = await store.get(idAuth)
            if (!id) {
                id = new IdModel();
                id.lastCoords = null
                id.routes = []
            }
            id.lastConnection = new Date()
            id.lastIp = req.ip
            id.routes = []
            await store.set(idAuth, id)

            return resp
                .send({success: true, id})
        } catch (e) {
            return resp
                .send({success: false, error: e.message})
        }
    })

    fastify.delete('/id', async (req, resp) => {
        try {
            const store = new IdStore(redis)
            const idAuth = (req.headers.authorization ?? '').replace(/Bearer /g, '')
            const id = await store.drop(idAuth)

            return resp
                .send({success: true})
        } catch (e) {
            return resp
                .send({success: false, error: e.message})
        }
    })
}

export default routes;
