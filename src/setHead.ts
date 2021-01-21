const xinzhou = import.meta.env.VITE_IS_XINZHOU;
if (xinzhou === 'true') {
  (document.querySelector('link[rel]') as Element).setAttribute('href', '/favicon-xinzhou.ico');
  document.querySelector('title')!.innerText = '新舟教学教研系统';
}
