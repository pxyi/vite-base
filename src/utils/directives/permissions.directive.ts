import store from '/@/store';
const handle = (el, binding) => {
  let [allowPath, isAdmin] = store.getters.userInfo.roles.reduce((group, role) => {
    group[0] += role.menuUrls;
    group[1] = group[1] || !!role.isAdmin;
    return group;
  }, ['', false]);
  if (isAdmin) { return; }
  let path = binding.instance.$route.path;
  if (binding.value) {
    if (Array.isArray(binding.value)) {
      !binding.value.reduce((allow, str) => allow || allowPath.includes(`${path}#${str}`), false) && el.remove()
    } else {
      !allowPath.includes(`${path}#${binding.value}`) && el && el.remove();
    }
  } else {
    el && el.remove();
  }
}

export default {
  name: 'permissions',
  mounted: handle,
  updated: handle
}