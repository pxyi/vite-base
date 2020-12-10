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
    title: '员工管理',
    key: '/customer',
    icon: import('./../assets/menu/icon-3.png'),
    children: [
      {
        title: '校区管理',
        key: '/customer/campus',
        isLeaf: true
      },
      {
        title: '教师管理',
        key: '/customer/teacher',
        isLeaf: true
      },
      {
        title: '角色管理',
        key: '/customer/role',
        isLeaf: true
      },
    ]
  }
]

export default MenuList;
