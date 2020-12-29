export interface RouterConf {
  title: string     // 标题
  key: string
  brief?: string     // 简称
  icon?: any
  disabled?: boolean,
  isLeaf?: boolean
  children?: RouterConf[]
}

const MenuList: RouterConf[] = [
  {
    title: '首页',
    key: '/index',
    isLeaf: true,
    icon: 'home'
  },
  {
    title: '教研中台',
    key: '/teaching',
    icon: 'teaching',
    children: [
      {
        title: '题库',
        key: '/teaching/question',
        isLeaf: true
      },
      {
        title: '试卷库',
        key: '/teaching/test-paper',
        isLeaf: true
      },
      {
        title: '批量录题',
        key: '/teaching/recording',
        isLeaf: true
      },
      {
        title: '资料库',
        key: '/teaching/resource-base',
        isLeaf: true
      },
    ]
  },
  {
    title: '日常教学',
    key: '/daily',
    icon: 'daily',
    children: [
      {
        title: '班级备授课',
        key: '/daily/prepare-teach',
        isLeaf: true
      },
    ]
  }
]

export default MenuList;
