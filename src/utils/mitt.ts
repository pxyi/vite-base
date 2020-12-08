
import mitt from 'mitt';
const emitter = mitt();
export default emitter;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: {
      all: any,
      on: (type: string, fn?: (data: any) => void) => void, 
      emit: (type: string, data?: any) => void,
      off: (type: string, fn?: (data: any) => void) => void
    };
  }
}