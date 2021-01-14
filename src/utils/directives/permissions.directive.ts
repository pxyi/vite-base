import store from './../../store';

const handle = (el, code) => {
  if (code.value) {
    let allowPath = store.getters.userInfo.roles.reduce((path, role) => path += role.menuUrls, '');
    !allowPath.includes(code.value) && el && el.remove();
  } else {
    el && el.remove();
  }
}

export default {
  name: 'permissions',
  mounted: handle,
  updated: handle
}