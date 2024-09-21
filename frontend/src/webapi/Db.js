// import { Dexie } from 'dexie'

class Db {
    dbName = 'randMarathonDb'
    storages = ['tracks']

    dbPointer

    constructor() {
        // this.dbPointer = new Dexie(this.dbName);
        // this.dbPointer.version(1).stores({
        //     tracks: 'id++, trackId, data'
        // })
        console.log('IndexDb inited')
    }

    async clearDb() {
        // return (await this.dbPointer.tracks.clear());
        localStorage.clear()
    }

    async loadTrack(trackId) {
        // return (await this.dbPointer.tracks.where({trackId: String(trackId)}).toArray());
        const data = localStorage.getItem(`track.${trackId}`)
        if (data) {
            return JSON.parse(data)
        }
    }

    async dropTrack(trackId) {
        // return new Promise((resolve, reject) => {
        //     const db = this.dbPointer.tracks
        //     this.dbPointer.transaction('rw', db, async () => {
        //         return db.where("trackId").equals(trackId).delete();
        //     }).then(() => {
        //         resolve()
        //     }).catch(reject)
        // });
        localStorage.removeItem(`track.${trackId}`)
    }

    async saveTrack(trackId, data) {
        // return new Promise((resolve) => {
        //     this.dbPointer.transaction('rw', this.dbPointer.tracks, () => {
        //         this.dbPointer.tracks.add({trackId: String(trackId), data: JSON.stringify(data) }).then(() => {
        //             resolve();
        //         })
        //     })
        // });
        localStorage.setItem(`track.${trackId}`, JSON.stringify(data))
    }
}

export default Db;