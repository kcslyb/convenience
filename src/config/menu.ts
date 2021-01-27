const SystemMenu: any = [
  {
    title: '基础数据',
    menus: [
      {
        title: '类型池',
        url: '/statistical/analysis',
        icon: 'description',
        perm: 'type-pool-manage'
      },
      {
        title: '类型转换关系',
        url: '/entity/relevance',
        icon: 'orders-o',
        perm: 'type-convert-manage'
      }
    ]
  }, {
    title: '事件记录',
    menus: [
      {
        title: '事件记录列表',
        url: '/record/notepad',
        icon: 'notes-o',
        perm: 'event-pool-manage'
      // }, {
      //   title: '事件记录统计',
      //   url: '/record/notepad',
      //   icon: 'notes-o',
      //   perm: 'type-statistics-manage'
      }
    ]
  }
]
export default SystemMenu
