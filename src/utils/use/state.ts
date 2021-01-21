import { ref, Ref } from 'vue';
const useState = <T>(init?: T): [Ref<T>, (val: T) => void] => {
  let state: Ref<T | any> = ref(init);
  return [
    state,
    (val) => state.value = val
  ];
}
export default useState;