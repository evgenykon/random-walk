import { reactive } from 'vue'

export const geoStore = reactive({

    geoApiData: null,
    apiError: null,

    get position() {
        return this.geoApiData ? [this.geoApiData.latitude, this.geoApiData.longitude,] : null
    },

    setGeoAPiData(value) {
        console.log(value)
        this.geoApiData = value
    },

    setApiError(err) {
        this.apiError = err;
    }
})