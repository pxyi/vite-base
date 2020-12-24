<template>
  <div 
    :id="`editor${instanceId}`" 
    class="cus__editor" 
    :class="{ 'is__focus': isFocus, 'is__hide__border': hideBorder }" 
    contenteditable="true" 
    :style="{ minHeight, height }"
  />
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'cus-editor',
  props: {
    modelValue: String,
    height: String,
    minHeight: String,
    hideBorder: Boolean
  },
  setup(props, { emit }) {
    let instanceId = ref(`${Math.random()}`.substring(2, 10));

    let editor = null;

    let isFocus = ref(false);
    onMounted(() => {
      new Promise(resolve => {
        let scriptDom = document.querySelector('#ckeditorScript');
        !!scriptDom ? setTimeout(() => resolve(window.CKEDITOR), 1000 ) : appendEditorJs(resolve);
      }).then(ck => {
        editor = window.CKEDITOR.inline(`editor${instanceId.value}`);
        editor.setData(props.modelValue || '')
        editor.on('change', () => emit('update:modelValue', editor.getData()) );
        editor.on('focus', () => { emit('focus', editor.getData()); isFocus.value = true; } );
        editor.on('blur', () => { emit('blur', editor.getData()); isFocus.value = false; } );
      })
    });

    onUnmounted(() => editor.destroy());

    return { instanceId, isFocus }
  }
}
const appendEditorJs = (resolve) => {
  let s = document.createElement('script');
  s.src = import.meta.env.VITE_EDITOR_PATH;
  s.id = 'ckeditorScript';
  s.onload = () => resolve(window.CKEDITOR);
  document.body.appendChild(s);
}
</script>
<style lang="scss" scoped>
.cus__editor {
  padding: 9px 12px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  outline: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  &.is__focus {
    border-color: #1aafa7;
  }
  &.is__hide__border {
    padding: 0;
    border-color: rgba($color: #fff, $alpha: 0);
  }
}
</style>
