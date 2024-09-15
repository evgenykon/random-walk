import { reactive } from 'vue'

export const marathonStore = reactive({

    list: [],
    current: null,

    new() {
        this.list.push({
            id: new Date().getTime(),
            title: `10 km / 10 points`,
            distance: 10000,
            totalPoints: 10,
            takenPoints: [],
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
        })
    }
})