import { createApp } from 'vue'
import router from './router'
import { RouterView } from 'vue-router';

import './index.scss';
import './element-variables.scss'
import './favicon';
import './core/axios'

import ElementPlus from 'element-plus';

import Store from './store';

import Components from './components';

const app = createApp(RouterView);

import Directives from './utils/directives';
Directives(app)

app.use(ElementPlus)
.use(router)
.use(Store)
.use(Components)
.mount('#app');

// window.addEventListener('unhandledrejection', event => { console.log(event.reason) });