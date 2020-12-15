<template>
  <div :id="`editor${instanceId}`" style="outline: none" contenteditable="true"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'cus-editor',
  props: {
    modelValue: String,
  },
  setup(props, { emit }) {
    let instanceId = ref(`${Math.random()}`.substring(1, 10));

    let editor = null;

    onMounted(async () => {
      await new Promise(resolve => {
        let scriptDom = document.querySelector('#ckeditorScript');
        scriptDom ? resolve() : appendEditorJs(resolve);
      });

      editor = window.CKEDITOR.inline(`editor${instanceId.value}`);
      editor.setData(props.modelValue || '')
      editor.on('change', () => emit('update:modelValue', editor.getData()) );
      editor.on('focus', () => emit('focus', editor.getData()) );
      editor.on('blur', () => emit('blur', editor.getData()) );
    });

    onUnmounted(() => editor.destroy());

    return { instanceId }
  }
}
const appendEditorJs = (resolve) => {
  let s = document.createElement('script');
  s.src = import.meta.env.VITE_EDITOR_PATH;
  s.id = 'ckeditorScript';
  s.onload = () => resolve();
  document.body.appendChild(s);
}
</script>
