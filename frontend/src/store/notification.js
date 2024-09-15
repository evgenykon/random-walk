import { reactive } from 'vue'

export const notificationStore = reactive({
    list: [],
    push(text) {
        this.list.push({
            text,
            id: Date.now() + Math.random() * 1000,
        })
    },
    delete(deletedItem) {
        const index = this.list.indexOf(deletedItem)
        if (index > -1) {
            this.list.splice(index, 1)
        }
    }
})