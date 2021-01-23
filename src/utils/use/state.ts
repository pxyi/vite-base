import { ref, Ref } from 'vue';
const useState = <T>(init?: T, setCallback?: (val: T) => void): [ Ref<T>, (val: T) => void ] => {
  let state: Ref<T | any> = ref(init);
  return [
    state,
    (val) => { state.value = val; setCallback && setCallback(val) }
  ];
}
export default useState;