export default () => {
  import.meta.env.MODE !== 'development' && (console.log = console.dir = console.info = () => {});
}
/**
 * @param el          需要滚动的dom
 * @param to          滚动条位置
 * @param duration    动画持续时间
 */
export const ScrollTop = (el:Element | HTMLElement, to = 0, duration?) => {
  const spacingTime = 20; //设置循环的间隔时间
  let spacingInex = duration / spacingTime; // 计算requestAnimationFrame次数
  function step(newTimestamp) {
    let nowTop = el.scrollTop; // 获取当前滚动条位置
    let everTop = (to - nowTop) / spacingInex; // 计算每次滑动的距离
    el.scrollTop = nowTop += everTop;
    spacingInex--;
    if (spacingInex > 0) requestAnimationFrame(step)
  };
  requestAnimationFrame(step)
};
