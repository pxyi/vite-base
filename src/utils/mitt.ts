
import mitt, { Emitter } from 'mitt';
const emitter = mitt();
export default emitter;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: Emitter;
  }
}