const common = {
  state: {
    notepadParams: {}
  },
  mutations: {
    SET_NOTEPAD_PARAMS: (state: any, data: any) => {
      state.notepadParams = data
    },
    RESET_NOTEPAD_PARAMS: (state: any) => {
      state.notepadParams = {}
    }
  },
  actions: {
    SET_NOTEPAD_PARAMS ({ commit }: { commit: any }, data: any) {
      commit('SET_NOTEPAD_PARAMS', data)
    }
  }
}

export default common
