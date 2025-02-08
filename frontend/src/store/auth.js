import { reactive } from 'vue'
import sha256 from 'sha256'
import axios from "axios";

import {useStorage} from '@vueuse/core'

export const authStore = reactive({

    auth: null,

    async init() {
        this.auth = useStorage('auth', sha256(Math.random()))
        await this.checkApiId()
    },

    get localAuthId() {
        return this.auth
    },

    generateNewAuth(value) {
        this.auth = sha256(Math.random())
    },

    async checkApiId() {
        const response = await axios.get('/api/id', {headers: `Authorization: Bearer ${this.localAuthId}`});
    }

})