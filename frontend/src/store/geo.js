import { reactive } from 'vue'

export const geoStore = reactive({

    geoApiData: null,
    apiError: null,

    get position() {
        //return this.geoApiData ? [this.geoApiData.latitude, this.geoApiData.longitude,] : null
        return [
            56.0195,
            37.2156, // 37.205,
        ];
    },

    setGeoAPiData(value) {
        console.log(value)
        this.geoApiData = value
    },

    setApiError(err) {
        this.apiError = err;
    }
})