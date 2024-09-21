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
        const data = localStorage.getItem(`track.${trackId}`)
        console.log('loadTrack', data)
        if (data) {
            return JSON.parse(data)
        }
    }

    async dropTrack(trackId) {
        localStorage.removeItem(`track.${trackId}`)
    }

    async saveTrack(trackId, data) {
        localStorage.setItem(`track.${trackId}`, JSON.stringify(data))
    }
}

export default Db;