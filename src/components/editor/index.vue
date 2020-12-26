<template>
  <div 
    :id="`editor${instanceId}`" 
    class="cus__editor"
    :data-placeholder="placeholder || ''"
    :class="{ 'is__focus': isFocus, 'is__hide__border': hideBorder, 'has__content': hasContent }" 
    contenteditable="true" 
    :style="{ minHeight, height }"
  />
</template>

<script lang="ts">
import { ref, Ref, onMounted, onUnmounted, computed, watch } from 'vue';

export default {
  name: 'cus-editor',
  props: {
    modelValue: String,
    height: String,
    minHeight: String,
    hideBorder: Boolean,
    placeholder: String
  },
  setup(props, { emit }) {
    let instanceId = ref(`${Math.random()}`.substring(2, 10));

    let editor: any = null;

    let isFocus: Ref<boolean> = ref(false);
    let hasContent = ref(false);
    onMounted(() => {
      setTimeout(() => {
        editor = window['CKEDITOR'].inline(`editor${instanceId.value}`);
        editor.setData(props.modelValue?.startsWith('<p>') ? props.modelValue : `<p>${props.modelValue || ''}</p>`);
        hasContent.value = !!props.modelValue;
        editor.on('change', () => { let data = editor.getData(); emit('update:modelValue', data); hasContent.value = !!data; } );
        editor.on('focus', () => { emit('focus', editor.getData()); isFocus.value = true; } );
        editor.on('blur', () => { emit('blur', editor.getData()); isFocus.value = false; } );
      });
    });

    onUnmounted(() => editor.destroy());

    return { instanceId, isFocus, hasContent }
  }
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
    &::before {
      display: none;
    }
  }
  &.has__content::before {
    display: none;
  }
  &.is__hide__border {
    padding: 0;
    border-color: rgba($color: #fff, $alpha: 0);
    background: rgba($color: #fff, $alpha: 0);
  }
  &::before {
    content: attr(data-placeholder);
    display: inline;
    pointer-events: none;
    position: absolute;
    color: #999;
  }
}
</style>
