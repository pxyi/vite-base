import { createApp } from 'vue'
import router from './router'
import { RouterView } from 'vue-router';

import './index.scss';
import './element-variables.scss'

import ElementPlus from 'element-plus';

import Axios from './core/axios';

import Components from './components';

const app = createApp(RouterView);

app.use(ElementPlus)
.use(Axios)
.use(router)
.use(Components)
.mount('#app');