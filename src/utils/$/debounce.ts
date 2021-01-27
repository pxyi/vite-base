const debounce = (fn, wait) => {
  let timeout;

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);

  }

}
export default debounce;