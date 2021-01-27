import SystemMenu from '@/config/menu'

const menu = {
  state: {
    currentMenus: []
  },
  mutations: {
    SET_MENU: (state: any, menus: any) => {
      state.currentMenus = menus
    },
    RESET_MENU: (state: any) => {
      state.currentMenus = {}
    }
  },
  actions: {
    generateRoutes({commit, state}: { commit: any, state: any }, permissions: any) {
      const menus: any[] = []
      SystemMenu.forEach((val: any) => {
        menus.push(val)
      })
      menus.map((value: any) => {
        if (value.menus) {
          const menusTemp = JSON.parse(JSON.stringify(value.menus || []))
          value.menus = menusTemp.filter((val: any) => permissions.includes(val.perm))
        }
      })
      commit('SET_MENU', menus)
    }
  }
}

export default menu
