import { encrypt, decrypt } from './aes';

interface StorageInterface {
  get: <T>(key: string) => null | string | T;
  set: (key: string, value: object | string) => void;
  remove: (key: string) => void;
}

const Storage: StorageInterface = {
  get<T>(key: string): T | null | string {
    let val = window.localStorage.getItem(encrypt(key));
    try {
      return JSON.parse(decrypt(val!));
    } catch (error) {
      return val ? decrypt(val) : null;
    }
  },
  set(key: string, value: Object | string) {
    let val = value instanceof Object ? JSON.stringify(value) : value;
    window.localStorage.setItem(encrypt(key), encrypt(val));
  },
  remove(key: string) {
    window.localStorage.removeItem(encrypt(key));
  }
};

export default Storage;