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
                    return reject(err);
                }
                resolve(val)
            })
        });
    }

    set(id, data) {
        return new Promise((resolve, reject) => {
            resolve({'aaa': 1})
        });
    }
}