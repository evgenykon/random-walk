import { reactive } from 'vue'
import { useStorage } from '@vueuse/core'


export const marathonStore = reactive({

    storage: null,
    list: [],
    current: null,

    distances: [
        {value: 3000, label: '3 km'},
        {value: 5000, label: '5 km'},
        {value: 10000, label: '10 km'},
        {value: 15000, label: '15 km'},
        {value: 21000, label: '21 km'},
        {value: 42000, label: '42 km'},
        {value: 50000, label: '50 km'},
        {value: 100000, label: '100 km'},
    ],

    points: [
        {value: 5, label: '5 points'},
        {value: 10, label: '10 points'},
        {value: 15, label: '15 points'},
        {value: 20, label: '20 points'},
    ],

    timeLimits: [
        {value: 1, label: '1 h'},
        {value: 2, label: '2 h'},
        {value: 3, label: '3 h'},
        {value: 4, label: '4 h'},
        {value: 5, label: '5 h'},
        {value: 6, label: '6 h'},
        {value: 7, label: '7 h'},
        {value: 8, label: '8 h'},
        {value: 9, label: '9 h'},
        {value: 10, label: '10 h'},
        {value: 24, label: '24 h'},
    ],

    init() {
        this.storage = useStorage('marathon', [])

        try {
            const storageList = this.storage
            if (storageList.length) {
                this.list = storageList;
            }
            console.log('Marathon store inited', storageList )
        } catch (e) {

        }
    },

    new(form) {
        this.list.push({
            id: new Date().getTime(),
            title: `${form.distance.label} / ${form.points.label} / ${form.timeLimit.label}`,
            distance: form.distance,
            totalPoints: form.points,
            takenPoints: [],
            timeLimit: form.timeLimit,
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
        })
        this.storage = this.list
    }
})