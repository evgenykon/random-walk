import {reactive} from 'vue'
import {useStorage} from '@vueuse/core'
import LineString from 'ol/geom/LineString.js'
import Circle from 'ol/geom/Circle.js'
import Db from "../webapi/Db.js";

class TargetCoords {
    lat
    long
    constructor(lat, long) {
        this.lat = lat;
        this.long = long;
    }
}

class Target {
    id
    order
    coords
    isVisible
    takeAt
    score
}

function generateTargets(number, center, distance, isAllVisible) {

    /**
     * @param basePoint {TargetCoords}
     * @param rotation {number}
     * @param distance {number} in meters
     * @returns {Array<import("../coordinate.js").Coordinate>}
     */
    function makeNewPoint(basePoint, rotation, distance) {
        // 1deg = 111,111 meters
        // x = distance
        // 56 lat, 37 long
        const distInDeg = distance / 111.111;
        const point1 = [.0, .0];
        const point2 = [distInDeg, .0];

        const line = new LineString([point1, point2]);
        line.translate(basePoint.lat, basePoint.long)
        line.rotate(rotation, [basePoint.lat, basePoint.long,]);
        return line.getLastCoordinate();
    }

    function degreesToRadians(degrees) {
        // Multiply degrees by pi divided by 180 to convert to radians.
        return degrees * (Math.PI/180);
    }

    function getRandomRotation () {
        return degreesToRadians(Math.floor(Math.random() * 360));
    }

    let targets = [];
    let lastPoint = new TargetCoords(center[0], center[1]);
    const distanceInterval = distance / (number - 1) / 1000;
    for (let i = 0; i < number; i++) {
        const newCoords = makeNewPoint(lastPoint, getRandomRotation(), distanceInterval);
        lastPoint = new TargetCoords(newCoords[0], newCoords[1]);
        targets.push({ id: Math.random(), order: i, coords: newCoords, isVisible: isAllVisible, takeAt: null, score: 0 });
    }
    return targets;
}


export const marathonStore = reactive({

    storage: null,
    list: [],
    current: null,

    scoreStorage: null,
    scoreBalance: 0,

    currentTrack: [],
    db: null,

    distances: [
        {value: 1000, label: '1 km'},
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

    get visibleTargets () {
        if (!this.current) {
            return [];
        }
        return this.current.targets.filter(target => target.isVisible);
    },

    get currentTarget() {
        return this.current.targets.filter(target => target.isVisible && !target.takeAt)[0] ?? null;
    },

    init() {
        this.storage = useStorage('marathon', [])
        this.scoreStorage = useStorage('scores', 0)
        this.db = new Db();

        try {
            const storageList = this.storage
            if (storageList.length) {
                this.list = storageList;
            }

            const score = this.scoreStorage
            if (score) {
                this.scoreBalance = score
            }

            console.log('Marathon store inited' )
        } catch (e) {
            console.error(e)
        }
    },

    async test(geo) {
        if (geo.length === 0 || !geo[0] || !geo[1]) {
            return;
        }
        const clearGeoObject = [geo[0], geo[1]];
        await this.db.saveTrack(this.list[0].id, clearGeoObject)
    },

    new(form, center) {
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
            targets: generateTargets(form.points.value, center, form.distance.value, form.isAllVisible),
            isDebug: form.isDebug,
            isAllTargetsVisibleAtStart: form.isAllVisible,
            isTrackEnabled: form.isTrackEnabled,
        })
        this.storage = this.list
    },

    async addGeoToTrack(geo) {
        if (!this.current) {
            console.log('addGeoToTrack >> no current')
            return;
        }
        if (!this.current.isTrackEnabled) {
            console.log('addGeoToTrack >> tracking  not enabled')
            return;
        }
        if (!this.currentTrack) {
            this.currentTrack = [];
        }
        if (geo.length === 0 || !geo[0] || !geo[1]) {
            console.log('addGeoToTrack >> geodata empty', geo)
            return;
        }
        const clearGeoObject = [geo[0], geo[1]];
        if (this.currentTrack.length > 0) {
            const lastGeoInTrack = this.currentTrack[this.currentTrack.length-1];
            const lastGeoInTrackLat = Math.floor(lastGeoInTrack[0] * 10000);
            const lastGeoInTrackLong = Math.floor(lastGeoInTrack[1] * 10000);

            const clearGeoLat = Math.floor(clearGeoObject[0] * 10000);
            const clearGeoLong = Math.floor(clearGeoObject[1] * 10000);
            if (lastGeoInTrackLat === clearGeoLat && lastGeoInTrackLong === clearGeoLong) {
                console.log('addGeoToTrack - skip same coords', clearGeoObject)
                return;
            }
        }
        this.currentTrack.push(clearGeoObject);
        try {
            await this.db.saveTrack(this.current.id, clearGeoObject);
        } catch (e) {
            console.error('saveTrack error', e)
        }
        console.log('addGeoToTrack >> add', clearGeoObject)
    },

    async setCurrent(item) {
        this.current = item

        this.list = this.list.map(listItem => {
            if (item.id === listItem.id) {
                return item;
            }
            return listItem;
        })

        this.storage = this.list

        try {
            const storedTrack = await this.db.loadTrack(item.id);
            if (storedTrack) {
                this.currentTrack = storedTrack.map(item => JSON.parse(item.data)).map(item => [parseFloat(item[0]), parseFloat(item[1])])
                console.log('Track loaded' )
            }
        } catch (e) {
            console.error('setCurrent load track error', e)
        }
    },

    async decline(item) {
        this.current = null;
        const index = this.list.indexOf(item);
        if (index > -1) {
            this.list.splice(this.list.indexOf(item), 1);
            this.storage = this.list;
            this.currentTrack = []
            try {
                await this.db.dropTrack(item.id);
                console.log('track deleted')
            } catch (e) {
                console.error('delete track error', e)
            }
        }
    },

    startCurrent() {
        this.current.startedAt = new Date().getTime();
        this.makeNextTargetVisible()
    },

    abortCurrent() {
        this.current.cancelledAt = new Date().getTime();
    },

    get currentScore () {
        return this.current?.takenPoints?.reduce((sum, item) => sum + item.score, 0) ?? 0
    },

    finishCurrent() {
        this.upBalance(this.currentScore)
        this.current.finishedAt = new Date().getTime();
    },

    checkIntersectionScore(geoPosition) {
        if (!this.currentTarget) {
            return 0;
        }
        const target = this.current.targets.find(target => target.isVisible && !target.takeAt);

        const smallCircle = new Circle(target.coords, 0.0003);
        const largeCircle = new Circle(target.coords, 0.001);

        const isIntersectSmall = smallCircle.intersectsCoordinate(geoPosition);
        const isIntersectLarge = largeCircle.intersectsCoordinate(geoPosition);

        if (isIntersectSmall) {
            return this.scoreForTargetCenter;
        }

        if (isIntersectLarge) {
            return this.scoreForTargetReach;
        }

        return 0;
    },

    get scoreForTargetReach() {
        if (!this.current) {
            return 0;
        }
        const score = this.calculateScore(this.current.distance.value, this.current.totalPoints.value, this.current.timeLimit.value)
        return score.perTargetRich;
    },

    get scoreForTargetCenter() {
        if (!this.current) {
            return 0;
        }
        const score = this.calculateScore(this.current.distance.value, this.current.totalPoints.value, this.current.timeLimit.value)
        return score.perTargetCenter;
    },

    checkPoint(geoPosition) {
        if (!this.currentTarget) {
            return;
        }

        const target = this.current.targets.find(target => target.isVisible && !target.takeAt);

        const smallCircle = new Circle(target.coords, 0.0003);
        const largeCircle = new Circle(target.coords, 0.001);

        const isIntersectSmall = smallCircle.intersectsCoordinate(geoPosition);
        const isIntersectLarge = largeCircle.intersectsCoordinate(geoPosition);

        let score = 0;
        if (isIntersectLarge) {
            score = this.scoreForTargetReach;
        }
        if (isIntersectSmall) {
            score = this.scoreForTargetCenter;
        }

        target.score = score;
        target.takeAt = new Date().getTime();

        this.current.takenPoints.push(target)

        if (this.current.takenPoints.length >= this.current.targets.length) {
            return this.finishCurrent();
        } else {
            this.makeNextTargetVisible()
        }
    },

    makeNextTargetVisible() {
        const target = this.current.targets.find(target => !target.isVisible && !target.takeAt);
        if (target) {
            target.isVisible = true;
        }
    },

    /**
     * @param distance
     * @param points
     * @param timeLimit
     * @returns {{perTargetRich: number, perTargetCenter: number, maximumForChallenge: number}}
     */
    calculateScore(distance, points, timeLimit) {
        // 3000 : 5 : 1h : center = 3000 / 5 = 600 / (10 * 1) = 60 per 1 point
        // 3000 : 5 : 1h : rich = 3000 / 5 / (12 * 1) = 50 per 1 point

        // 10000 : 5 : 1h : center = 10000 / 5 / (10 * 1) = 200 per 1 point
        // 10000 : 5 : 1h : rich = 10000 / 5 / (12 * 1) = 167 per 1 point

        // 10000 : 5 : 5h : center = 10000 / 5 / (10 * 5) = 40 per 1 point
        // 10000 : 5 : 5h : rich = 10000 / 5 / (12 * 5) = 34 per 1 point

        const maxPointPerTarget = Math.floor(distance / points / (timeLimit * 10));

        return {
            perTargetRich: Math.floor(distance / points / (timeLimit * 12)),
            perTargetCenter: maxPointPerTarget,
            maximumForChallenge: maxPointPerTarget * points,
        }
    },

    get currentStatus() {
        return this.getStatus(this.current)
    },

    getStatus(marathon) {
        if (!marathon.startedAt) {
            return 'Not started';
        }
        if (marathon.startedAt && !marathon.cancelledAt && !marathon.finishedAt) {
            return 'Running';
        }
        if (marathon.cancelledAt) {
            return 'Cancelled';
        }
        if (marathon.finishedAt) {
            return 'Finished';
        }
        return '-'
    },

    upBalance(value) {
        this.scoreBalance += value
    }
})