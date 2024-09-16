import {computed, reactive} from 'vue'
import { useStorage } from '@vueuse/core'
import LineString from 'ol/geom/LineString.js'
import Circle from 'ol/geom/Circle.js'

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
        targets.push({ id: Math.random(), order: i, coords: newCoords, isVisible: isAllVisible ? true : (i === 0), takeAt: null, score: 0 });
    }
    return targets;
}

export const marathonStore = reactive({

    storage: null,
    list: [],
    current: null,

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

        try {
            const storageList = this.storage
            if (storageList.length) {
                this.list = storageList;
            }
            console.log('Marathon store inited', storageList )
        } catch (e) {

        }
    },

    new(form, center) {
        console.log('new', form)
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
        })
        this.storage = this.list
    },

    setCurrent(item) {
        this.current = item

        this.list = this.list.map(listItem => {
            if (item.id === listItem.id) {
                return item;
            }
            return listItem;
        })

        this.storage = this.list
    },

    decline(item) {
        this.current = null;
        const index = this.list.indexOf(item)
        if (index > -1) {
            this.list.splice(this.list.indexOf(item), 1)
            this.storage = this.list
        }
    },

    startCurrent() {
        this.current.startedAt = new Date().getTime();
        this.showNextTarget()
    },

    abortCurrent() {
        this.current.cancelledAt = new Date().getTime();
    },

    finishCurrent() {
        this.current.finishedAt = new Date().getTime();
    },

    showNextTarget() {
        if (this.current.targets.length === 0) {
            return this.finishCurrent();
        }
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
        target.isVisible = true;
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
    }
})