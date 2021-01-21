const xinzhou = import.meta.env.VITE_IS_XINZHOU;
const jinbang = import.meta.env.VITE_IS_JINBANG;
if (xinzhou === 'true') {
  (document.querySelector('link[rel]') as Element).setAttribute('href', '/favicon-xinzhou.ico');
  document.querySelector('title')!.innerText = '新舟教学教研系统';
};

if (jinbang === 'true') {
  document.querySelector('title')!.innerText = '金榜爱学';
}

