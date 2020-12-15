
/*
 * @Method CreateElement
 *
 * @param tagName: HTMLElementTagNameMap
 * @param options?: { attrs: object, className: string | string[], style: object, on: Object<EventListener> }
 * @param content?: string | HTMLElement
 */
const createElement = (tagName, options?, content?) => {
  let { attrs, className, style, on } = options || {};
  let element = document.createElement(tagName);
  attrs && Object.keys(attrs).map(key => element.setAttribute(key, attrs[key]));
  className && (typeof className === 'string' ? element.classList.add(className) : className.map(c => element.classList.add(c)));
  style && Object.keys(style).map(key => element.style[key] = style[key]);
  on && Object.keys(on).map(event => element[`on${event}`] = on[event]);
  if (!content) {
    return element;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.map(cont => element.appendChild(cont));
  } else {
    element.innerHTML = content;
  }
  return element;
}
export default createElement;