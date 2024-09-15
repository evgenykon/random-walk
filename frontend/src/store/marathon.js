import { reactive } from 'vue'
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

function generateTargets(number, center, distance) {

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
        console.log('distInDeg', distance, distInDeg)
        const point1 = [.0, .0];
        const point2 = [distInDeg, .0];

        const line = new LineString([point1, point2]);
        console.log('line1', line.getLastCoordinate())
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
        targets.push({ id: Math.random(), order: i, coords: newCoords, isVisible: true, takeAt: null, score: 0 });
    }
    return targets;
}

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
            targets: generateTargets(form.points.value, center, form.distance.value)
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

    checkPoint(geoPosition) {
        if (!this.currentTarget) {
            return;
        }

        const smallCircle = new Circle(this.currentTarget.coords, 0.0003);
        const largeCircle = new Circle(this.currentTarget.coords, 0.001);

        const isIntersectSmall = smallCircle.intersectsCoordinate(geoPosition);
        const isIntersectLarge = largeCircle.intersectsCoordinate(geoPosition);

        let score = 0;
        if (isIntersectLarge) {
            score += 100;
        }
        if (isIntersectSmall) {
            score += 150;
        }
        this.currentTarget.takeAt = new Date().getTime();
        this.currentTarget.score = score;

        this.current.takenPoints.push(this.currentTarget)

        if (this.current.takenPoints.length >= this.current.targets.length) {
            return this.finishCurrent();
        }
    }
})