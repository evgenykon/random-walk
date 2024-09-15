import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";
import 'bulma/bulma.scss';
import 'bulma/sass/themes/_index.scss';

const app = createApp(App)
app.use(OpenLayersMap);
app.mount('#app')
