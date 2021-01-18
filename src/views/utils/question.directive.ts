export default {
  mounted(el, data) {
    if (data) {
      let html = questToHtml(data.value);
      html ? (el.innerHTML = html) : el.remove();
    }
  },
  updated(el, data) {
    if (data) {
      let html = questToHtml(data.value);
      html ? (el.innerHTML = html) : el.remove();
    }
  }
}

const cellToAttrs = (num) => `<div class="e-m-cell" style="width: ${ 100 / (num || 1) }%">`;
export const questToHtml = (data) => {
  let main = `<div class="e-main" style="display: flex; flex-wrap: wrap">`;
  if (data.basicQuestionType < 3) {
    let options = `${cellToAttrs(data.optionNum)}${data.option ? data.option.map(e => `${e.name}.${e.content}`).join(`</div>${cellToAttrs(data.optionNum)}`) : ''}</div>`
    let html = `${main}${options}</div>`
    return html
  } else if (data.basicQuestionType === 9) {
    let child = (c) => `<div>${c.name}.${c.content}</div>`;
    let cell = (c, idx) => `<div class="e-c-label">${idx + 1}.${c.title}</div>${c.option ? `<div class="e-c-group">${c.option.map(child).join(``)}</div>` : ''}`;
    let options = `${cellToAttrs(data.optionNum)}${data.childs.map(cell).join(`</div>${cellToAttrs(data.optionNum)}`)}</div>`
    let html = `<div class="e-main-title" style="display: flex; flex-wrap: wrap">${options}</div>`;
    return html;
  } else if (data.basicQuestionType === 10) {
    let child = (c) => `${c.name}.${c.content}`;
    let cell = (c) => `<div class="e-c-label">${c.name}.</div><div class="e-c-group"><div class="c-t-item">${c.childs.map(child).join(`</div><div class="c-t-item">`)}</div></div>`;
    let options = `${cellToAttrs(data.optionNum)}${data.option.map(cell).join(`</div>${cellToAttrs(data.optionNum)}`)}</div>`
    let html = `${main}${options}</div>`
    return html
  } else {
    return ''
  }
}