export default () => {
  import.meta.env.MODE !== 'development' && (console.log = console.dir = console.info = () => {});
}
/**
 * @param el  需要滚动的dom
 * @param number  滚动位置
 * @param time    滚动时间
 */
export const ScrollTop = (el:Element, number = 0, time?) => {
  if (!time) el.scrollTop = number;
  const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
  let spacingInex = time / spacingTime; // 计算循环的次数
  let nowTop = el.scrollTop; // 获取当前滚动条位置
  let everTop = (number - nowTop) / spacingInex; // 计算每次滑动的距离
  let scrollTimer = setInterval(() => {
    if (spacingInex > 0) {
      spacingInex--;
      ScrollTop(el, nowTop += everTop);
    } else {
      clearInterval(scrollTimer); // 清除计时器
    }
  }, spacingTime);
};
