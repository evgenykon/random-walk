export default class IdStore {
    redis
    constructor(redis) {
        this.redis = redis
    }

    get(id) {
        const redis = this.redis
        return new Promise((resolve, reject) => {
            redis.get(`id:${id}`, (err, val) => {
                if (err) {
                    console.error(`id:${id} error`, err)
                    return reject(err);
                }
                console.log(`get id:${id}`, val)
                resolve(JSON.parse(val))
            })
        });
    }

    set(id, data) {
        const redis = this.redis
        return new Promise((resolve, reject) => {
            const serialized = JSON.stringify(data);
            console.log(`set id:${id}`, serialized)
            redis.set(`id:${id}`, serialized, (err, val) => {
                if (err) {
                    console.error(`id:${id} error`, err)
                    return reject(err);
                }
                console.log(`set id:${id} done`)
                resolve(val)
            });
        });
    }

    drop(id) {
        const redis = this.redis
        return new Promise((resolve, reject) => {
            console.log(`del id:${id}`)
            redis.del(`id:${id}`, (err, val) => {
                console.log(`del id:${id} done`)
                if (err) {
                    console.error(`id:${id} drop`, err)
                    return reject(err);
                }
                resolve(val)
            })
        });
    }
}