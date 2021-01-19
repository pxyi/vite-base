import ElementPlus from 'element-plus';
import { Component, createApp } from 'vue';
import createElement from './../createElement';
import Components, { AppComponents } from '/@/components';
import './drawer.scss';
import Store from '/@/store';
import Directives from '/@/utils/directives';

const create = (opt: DrawerCreate): Promise<any> => {
  let options = {
    title: opt.title || null,
    width: opt.width || 720,
    maxWidth: opt.maxWidth || 'auto',
    component: opt.component === 'form' || !opt.component ? AppComponents.CusForm : opt.component,
    props: opt.props || {},
    zIndex: opt.zIndex || 2000,
    mask: typeof opt.mask === 'undefined' ? true : opt.mask,
    maskClosable: typeof opt.maskClosable === 'undefined' ? true : opt.maskClosable,
    closable: typeof opt.closable === 'undefined' ? true : opt.closable,
    footed: typeof opt.footed === 'undefined' ? true : opt.footed
  }

  return new Promise((resolve, reject) => {

    const container = createElement('div', { className: `__drawer__${ Date.now() }` });

    let drawerBox = createElement('div', { className: 'drawer-box', style: { width: options.width > 0 ? `${options.width}px` : options.width, maxWidth: options.maxWidth > 0 ? `${options.maxWidth}px` : options.maxWidth, zIndex: `${options.zIndex + 1}` } });
    let drawerBody = createElement('div', { className: 'drawer-body' });

    const remove = (val?) => {
      maskEl.classList.add('active');
      drawerBox.classList.add('active');
      setTimeout(() => {
        app.unmount(drawerBody);
        document.body.removeChild(container);
      }, 500);
      val ? resolve(val) : reject(false);
    };

    const app = createApp(options.component, { ...options.props });
    Directives(app)
    app.use(Components);
    app.use(Store);
    app.use(ElementPlus);
    app.provide('close', remove);
    const vm = app.mount(drawerBody);

    drawerBox.appendChild(drawerBody);
    container.appendChild(drawerBox);

    let maskEl = createElement('div', { className: 'drawer-mask', style: { zIndex: `${options.zIndex}` }, on: { click: () => options.maskClosable && remove() } })
    options.mask && container.appendChild(maskEl);

    if (options.title) {
      let titleEl = createElement('div', { className: 'drawer-title' }, createElement('span', {}, options.title));
      if (options.closable) {
        let iconEl = createElement('i', { className: 'el-icon-close' })
        iconEl.onclick = () => { remove() };
        titleEl.appendChild(iconEl);
      }
      drawerBox.insertBefore(titleEl, drawerBox.children[0]);
    }

    if (options.footed) {
      let saveOnClick = () => {
        if (vm['save']) {
          new Promise((resolve, reject) => {
            vm['save'](resolve, reject);
            saveBtn.classList.add('loading');
            saveBtn.insertBefore(createElement('i', { className: 'el-icon-loading' }), saveBtn.children[0]);
          }).then((res) => remove(res || true)).catch(err => {
            saveBtn.querySelector('i')?.remove()
            saveBtn.classList.remove('loading');
          })
        } else {
          console.warn(`请在 ${options.component.name} Component 中定义 save 方法`);
        }
      }
      let closeBtn = createElement('button', { className: 'drawer-close-btn', on: { click: () => remove() } }, createElement('span', {}, '取消'));
      let saveBtn = createElement('button', { className: 'drawer-save-btn', on: { click: saveOnClick } }, createElement('span', {}, '确定'));

      let drawerFooter = createElement('div', { className: 'drawer-footer' }, [closeBtn, saveBtn]);
      drawerBox.appendChild(drawerFooter);
    }


    document.body.appendChild(container);
  });

}
const closeAll = () => {
  let drawer = document.querySelectorAll('[class^=__drawer__]') || [];
  drawer.forEach(i => i.remove());
}
export default { create, closeAll };

/*
 * @Method CreateElement
 *
 * @param tagName: HTMLElementTagNameMap
 * @param options?: { attrs: object, className: string | string[], style: object, on: Object<EventListener> }
 * @param content?: string | HTMLElement
 */


interface DrawerCreate {
  title?: string;
  width?: number | string;
  maxWidth?: number | string;
  component: Component | 'form';     // 子组件
  mask?: boolean;          // 是否展示遮罩
  zIndex?: number;
  maskClosable?: boolean;  // 点击蒙层是否允许关闭
  closable?: boolean;      // 是否展示右上角关闭按钮
  props?: object;          // 传入子组件的值
  footed?: boolean;         // 是否拥有默认页脚
}