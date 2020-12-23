import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import createElement from './../createElement';
import Components from './../../components';
import Store from './../../store';
import router from './../../router'
const create = (component, props = {}) => {
  
  return new Promise((resolve, reject) => {

    let body = createElement('div', { style: { overflow: 'auto', height: '100%', background: '#fff' } });

    let closeBtn = createElement('div', { 
      className: 'el-icon-back', 
      style: { fontSize: '28px', position: 'fixed', top: '15px', left: '30px', color: '#fff', cursor: 'pointer' },
      on: { click: () => remove() }
    })

    const remove = (val?) => {
      container.remove();
      app.unmount(body);
      val ? resolve(val) : reject(false);
    }
    const app = createApp(component, { ...props });
    app.use(Components);
    app.use(Store);
    app.use(ElementPlus);
    app.provide('close', remove);
    app.use(Components)
    app.use(router)
    const vm = app.mount(body);

    let container = createElement('div', { style: { width: '100%', height: '100%', position: 'fixed', zIndex: '999', top: '0' } }, [closeBtn, body]);
    document.body.appendChild(container);
  });
}



export default { create }


interface ScreenCreate {

}