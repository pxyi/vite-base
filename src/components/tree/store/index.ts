import Vuex from 'vuex';

export interface ItemData {
  key: string;
  title: string;
  children?: any[];
  level?: number;
  opened?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  loading?: boolean;
  isLeaf?: boolean;
  selected?: boolean;
}

interface State {
  data: any[];
}

const state = {
  data: []
}


const mutations = {
  set_data(state: State, payload: ItemData[]) {
    state.data = init(payload, 0);
  },

  /* 展开收起 */
  set_item_opened(state: State, payload: { key: string }) {
    setState(state.data, payload.key, (node) => node.opened = !node.opened );
  },

  set_item_selected(state: State, key: string) {
    getItems(state.data, (item) => item.key !== key && (item.selected = false));
  },

  /* 节点选择触发 */
  set_item_checked(state: State, payload: { key: string  }) {
    /* 设置该节点下所有子节点选择状态 */
    setState(state.data, payload.key, (node) => {
      node.children && getItems(node.children, (item) => item.checked = node.checked);
    });
    
    /* 遍历整个节点树，更改其选中状态 */
    getItemList(state.data).reverse().map(node => {
      if (node.children) {
        let c = childrenChecked(node.children);
        node.checked = c.includes(true);
        node.indeterminate = isIndeterminate(node.children);
      }
    });
  }
}

export default new Vuex.Store({
  state,
  mutations
});
const init = (data: ItemData[], level: number) => {
  return data.map(item => {
    item.level = level;
    item.opened = false;
    item.checked = false;
    item.indeterminate = false;
    item.isLeaf = false;
    item.children && (item.children = init(item.children, level + 1))
    return item;
  })
}
/* 
 * 根据 key 找到对应节点， 执行回调函数
 */
const setState = (data: ItemData[], key: string, fn: (arg: ItemData) => void) => {
  data.map(item => item.key === key ? fn(item) : (item.children && setState(item.children, key, fn)))
}

/*
 * 找到所有节点， 执行回调函数
 */
const getItems = (data: ItemData[], fn: (arg: ItemData) => void) => {
  data.map(item => { fn(item); item.children && getItems(item.children, fn) })
}
const getItemList = (data: ItemData[]): ItemData[] => {
  let nodeList: ItemData[] = [];
  const all = (node: ItemData[]) => {
    node.map(n => nodeList.push(n) && n.children && all(n.children));
  }
  all(data);
  return nodeList;
}

/*
 * 获取所有子孙节点选中状态， 返回其状态集合
 */
const childrenChecked = (data: ItemData[]): boolean[] => {
  let checkedList: boolean[] = [];
  const allItem = (list: ItemData[]) => {
    list.map(node => {
      checkedList.push(node.checked as boolean);
      node.children && allItem(node.children);
    })
  }
  allItem(data);
  return checkedList;
}

/*
 * 判断节点是否为不确定选中状态
 */
const isIndeterminate = (data: ItemData[]) => {
  let checkedList: boolean[] = [];
  const allItem = (list: ItemData[]) => {
    list.map(node => {
      checkedList.push(node.checked as boolean);
      node.children && allItem(node.children);
    })
  }
  allItem(data);
  for (let i = 0; i < checkedList.length - 1; i++) {
    if (checkedList[i] !== checkedList[i + 1]) {
      return true;
    }
  }
  return false;
}