<template>
  <cus-query :nodes="nodeList"></cus-query>
</template>

<script>
export default {
  setup(props, ctx) {
    let nodeList = [
    { label: '校区名称', key: 'name', type: 'input' },
    // { label: '角色名称', key: 'roleId', type: 'select', placeholder: '请输入小区名称', url: '/api/getRole' },
    { label: '状态', key: 'status', type: 'select', labelKey: 'label', valueKey: 'value', options: [ { label: '启用', value: 1 }, { label: '禁用', value: 0 }, ] }
  ];

    return { nodeList } 
  }
}
</script>
