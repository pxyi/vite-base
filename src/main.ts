import { createApp } from 'vue'
import router from './router'
import { RouterView } from 'vue-router';

import './index.scss';
import './element-variables.scss'

import ElementPlus from 'element-plus';

import Axios from './core/axios';
import Store from './store';

import Components from './components';

const app = createApp(RouterView);

app.use(ElementPlus)
.use(Axios)
.use(router)
.use(Store)
.use(Components)
.mount('#app');