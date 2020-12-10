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
        key: '/test/test',
        isLeaf: true
      },
      {
        title: 'ckeditor',
        key: '/test/ckeditor',
        isLeaf: true
      },
      {
        title: 'tree',
        key: '/test/tree',
        isLeaf: true
      },
      {
        title: '年级管理',
        key: '/education/grade',
        isLeaf: true
      },
      {
        title: '学期管理',
        key: '/education/semester',
        isLeaf: true
      },
      {
        title: '教材版本',
        key: '/education/version',
        isLeaf: true
      },
      {
        title: '课程体系',
        key: '/education/course-system',
        isLeaf: true
      },
      {
        title: '章节体系',
        key: '/education/chapter-system',
        isLeaf: true
      },
      {
        title: '知识点体系',
        key: '/education/knowledge',
        isLeaf: true
      }
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
