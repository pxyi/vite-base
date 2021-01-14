import store from './../../store';

const handle = (el, binding) => {
  let path = binding.instance.$route.path;
  if (binding.value) {
    let allowPath = store.getters.userInfo.roles.reduce((path, role) => path += role.menuUrls, '');
    !allowPath.includes(`${path}#${binding.value}`) && el && el.remove();
  } else {
    el && el.remove();
  }
}

export default {
  name: 'permissions',
  mounted: handle,
  updated: handle
}