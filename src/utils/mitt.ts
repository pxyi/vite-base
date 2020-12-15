
import mitt, { Emitter } from 'mitt';
const emitter = mitt();
export default emitter;

export const EventBus = (vue) => vue.config.globalProperties.$bus = emitter;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: Emitter;
  }
}