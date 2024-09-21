import { reactive } from 'vue'

export const geoStore = reactive({

    geoApiData: null,
    apiError: null,

    get position() {
        return this.geoApiData ? [this.geoApiData.latitude, this.geoApiData.longitude,] : null
    },

    setGeoAPiData(value) {
        this.geoApiData = value
    },

    setApiError(err) {
        this.apiError = err;
    },

    testChangeGeo(up, right) {
        this.geoApiData = {
            latitude: this.position[0] + up,
            longitude: this.position[1] + right,
        }
    }
})