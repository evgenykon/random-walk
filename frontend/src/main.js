import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";
import 'bulma/bulma.scss';
import 'bulma/sass/themes/_index.scss';

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
library.add(fas)

const app = createApp(App)
app.use(OpenLayersMap);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
