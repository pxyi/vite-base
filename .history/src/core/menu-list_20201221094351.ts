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
    icon: import('./../assets/menu/icon-1.png')
  },
  {
    title: '测试',
    key: '/test',
    icon: import('./../assets/menu/icon-2.png'),
    children: [
      {
        title: '测试',
        key: '/test/test1',
        isLeaf: true
      },
      {
        title: 'ckeditor',
        key: '/test/editor',
        isLeaf: true
      },
      {
        title: 'tree',
        key: '/test/tree',
        isLeaf: true
      },
    ]
  },
  {
    title: '教研中台',
    key: '/teaching',
    icon: import('./../assets/menu/icon-3.png'),
    children: [
      {
        title: '试卷库',
        key: '/teaching/test-paper',
        isLeaf: true
      },
      {
        title: '备授课',
        key: '/teaching/prepare-teach',
        isLeaf: true
      },
      {
        title: '教师管理',
        key: '/teaching/teacher',
        isLeaf: true
      },
      {
        title: '角色管理',
        key: '/teaching/role',
        isLeaf: true
      },
    ]
  },
  {
    title: '日常教学',
    key: '/teaching',
    icon: import('./../assets/menu/icon-3.png'),
    children: [
      {
        title: '班级备授课',
        key: '/teaching/prepare-teach',
        isLeaf: true
      },
    ]
  }
]

export default MenuList;
