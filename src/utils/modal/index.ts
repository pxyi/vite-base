import { Component, createApp } from 'vue';
import ModalForm from './form.vue';
import createElement from './../createElement';
import './modal.scss';

const create = (opt: ModalCreate) => {
  let options = {
    title: opt.title || null,
    width: opt.width || 720,
    component: opt.component === 'form' ? ModalForm : opt.component,
    props: opt.props || {},
    zIndex: opt.zIndex || 200,
    mask: typeof opt.mask === 'undefined' ? true : opt.mask,
    maskClosable: typeof opt.maskClosable === 'undefined' ? true : opt.maskClosable,
    closable: typeof opt.closable === 'undefined' ? true : opt.closable,
    footed: typeof opt.footed === 'undefined' ? true : opt.footed,
    headerStyle: opt.headerStyle || {},
    bodyStyle: opt.bodyStyle || {},
  }

  return new Promise(resolve => {
    

    const container = createElement('div');
    let maskEl = createElement('div', { className: 'modal-mask', style: { zIndex: `${options.zIndex}` }, on: { click: () => options.maskClosable && remove() } })
    options.mask && container.appendChild(maskEl);
    let modalBox = createElement('div', { className: 'modal-box', style: { width: `${options.width}px`, zIndex: `${options.zIndex + 1}` } });
    let modalBody = createElement('div', { className: 'modal-body', style: options.bodyStyle });

    modalBox.appendChild(modalBody);
    container.appendChild(modalBox);

    if (options.title) {
      let ModalHeader = createElement('div', { className: 'modal-header', style: options.headerStyle }, createElement('span', {}, options.title));
      if (options.closable) {
        let iconEl = createElement('i', { className: 'el-icon-close', on: { click: () => remove() } });
        ModalHeader.appendChild(iconEl);
      }
      modalBox.insertBefore(ModalHeader, modalBox.children[0]);
    }

    if (options.footed) {
      let closeBtn = createElement('button', { className: 'modal-close-btn', on: { click: () => remove() } }, createElement('span', {}, '取消'));
      let saveOnClick = () => {
        if (vm['save'] && vm['save'].constructor === Function) {
          new Promise((resolve, reject) => {
            vm['save'](resolve, reject);
            saveBtn.classList.add('loading');
            saveBtn.insertBefore(createElement('i', { className: 'el-icon-loading' }), saveBtn.children[0]);
          }).then(remove).catch(err => {
            saveBtn.querySelector('i').remove()
            saveBtn.classList.remove('loading');
          })
        } else {
          remove();
          console.warn(`请在 ${options.component.name} Component 中定义 save 方法`);
        }
      }
      let saveBtn = createElement('button', { className: 'modal-save-btn', on: { click: saveOnClick } }, createElement('span', {}, '确定'));

      let modalFooter = createElement('div', { className: 'modal-footer' }, [ closeBtn, saveBtn ]);
      modalBox.appendChild(modalFooter);
    }

    const remove = (val?) => {
      maskEl.classList.add('active');
      modalBox.classList.add('active');
      setTimeout(() => {
        document.body.removeChild(container);
      }, 500);
      app.unmount(modalBody);
      val && resolve(val);
    };

    const app = createApp(options.component, { ...options.props });
    const vm = app.mount(modalBody);

    document.body.appendChild(container);

  })
}


export default { create };

interface ModalCreate {
  title?: string;
  width?: number;
  component: Component | 'form';     // 子组件
  mask?: boolean;          // 是否展示遮罩
  zIndex?: number;
  maskClosable?: boolean;  // 点击蒙层是否允许关闭
  closable?: boolean;      // 是否展示右上角关闭按钮
  props?: object;          // 传入子组件的值
  footed?: boolean;         // 是否拥有默认页脚
  headerStyle?: object;     // modal-header 样式
  bodyStyle?: object        // modal-body 样式
}