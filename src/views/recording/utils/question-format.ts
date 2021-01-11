import { cloneDeep } from 'lodash';

export const questionFormat = (quest) => {
  let data = cloneDeep(quest);
  if (data.basicQuestionType === 2 || data.basicQuestionType === 10) {
    let f = data.basicQuestionType === 2 ? ';' : ''
    data.answer = data.rightAnswer ? data.rightAnswer.map(i => i.content).join(f) : '';
  } else if (data.basicQuestionType === 3 || data.basicQuestionType === 9) {
    data.answer = data.rightAnswer ? data.rightAnswer.map((i, idx) => `${idx + 1}.${i.content}`).join('<br>') : '';
  } else {
    data.answer = data.rightAnswer ? data.rightAnswer[0].content : '';
  }
  if (data.basicQuestionType < 3) {
    data.title = `${data.title}<br>${data.option ? data.option.map(i => `${i.name}.${i.content}`).join('<br>') : ''}`
  }
  if (data.childs && data.childs.length) {
    data.title = `${data.title}<br>${data.childs.map((i, idx) => `${idx + 1}.${i.title}<br>${i.option ? i.option.map(c => `${c.name}.${c.content}`).join('<br>') : []}`).join('<br>')}`
  }
  if (data.basicQuestionType === 10) {
    data.title = `${data.title}<br>${data.option.map(i => `${i.name}.<br>${i.childs.map(c => `${c.name}.${c.content}`).join('<br>')}`).join('<br>')}`
  }
  data.questionSources && data.questionSources.map(i => { i.provinceCity = i.areaId ? [i.provinceId, i.cityId, i.areaId] : null; return i; });

  return data;
}