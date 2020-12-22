import { createApp } from 'vue'
import router from './router'
import { RouterView } from 'vue-router';

import './index.scss';
import './element-variables.scss'

import ElementPlus from 'element-plus';

import Axios from './core/axios';
import Store from './store';

import Components from './components';

import Basics from './utils/base';
Basics();

import { EventBus } from './utils/mitt';

const app = createApp(RouterView);

app.use(ElementPlus)
.use(EventBus)
.use(Axios)
.use(router)
.use(Store)
.use(Components)
.mount('#app');


// window.addEventListener('unhandledrejection', event => { console.log(event.reason) });