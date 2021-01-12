import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import createElement from './../createElement';
import Components from './../../components';
import Store from './../../store';
import router from './../../router';

const create = (component, props = {}) => {
  return new Promise((resolve, reject) => {

    let historyState = history.state;
    let url = document.URL;
    const popstateFn = () => {
      remove();
      history.replaceState(historyState, '', url);
      history.go(1);
    }

    window.addEventListener('popstate', popstateFn);

    let body = createElement('div', { className: `__screen__${ Date.now() }`, style: { overflow: 'auto', height: '100%', background: '#fff' } });

    let closeBtn = createElement('div', { 
      className: 'el-icon-back', 
      style: { fontSize: '28px', position: 'fixed', top: '15px', left: '30px', color: '#fff', cursor: 'pointer', zIndex: 1 },
      on: { click: () => remove() }
    })

    const remove = (val?) => {
      window.removeEventListener('popstate', popstateFn);
      container.remove();
      app.unmount(body);
      val ? resolve(val) : reject(false);
    }
    const app = createApp(component, { ...props, close: remove });
    Object.keys(props).map(key => app.provide(key, props[key]));
    app.use(Components);
    app.use(Store);
    app.use(ElementPlus);
    app.provide('close', remove);
    app.use(router)
    const vm = app.mount(body);

    let container = createElement('div', { style: { width: '100%', height: '100%', position: 'fixed', zIndex: '2010', top: '0' } }, [closeBtn, body]);
    document.body.appendChild(container);
  });
}


const closeAll = () => {
  let screen = document.querySelectorAll('[class^=__screen__]') || [];
  screen.forEach(i => i.remove());
}

export default { create, closeAll }


interface ScreenCreate {

}