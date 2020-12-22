export const crypto = (): Promise<{ encrypt: ([key]: string) => string, decrypt: ([key]: string) => string }> => {
  let id = 'cryptoJS';
  return new Promise(resolve => {
    if (document.querySelector(`#${id}`)) {
      resolve(__aes(window['CryptoJS']))
    } else {
      let script = document.createElement('script');
      script.id = id;
      script.src = './crypto-js.min.js';
      script.onload = () => resolve(__aes(window['CryptoJS']))
      document.body.appendChild(script);
    }
  })
}

const __aes = (CryptoJS) => {
  /* ------------------ AES加密 ------------------ */
  const key = CryptoJS.enc.Utf8.parse('phuhoang');
  const iv = CryptoJS.enc.Utf8.parse('');
  return {
    encrypt: (word: any) => {
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      return encrypted.ciphertext.toString().toUpperCase();
    },
    decrypt: (word: any) => {
      let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    }
  }
}