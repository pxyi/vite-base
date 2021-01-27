const xinzhou = import.meta.env.VITE_IS_XINZHOU;
const jinbang = import.meta.env.VITE_IS_JINBANG;
if (xinzhou === 'true') {
  document.getElementById('icon')!.setAttribute('href', '/favicon-xinzhou.ico');
  document.title = '新舟教学教研系统';
};

if (jinbang === 'true') {
  document.title = '金榜爱学';
}

