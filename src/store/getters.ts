const getters = {
  userInfo: (state: any) => state.user.userInfo,
  userId: (state: any) => state.user.userInfo.userId,
  avatar: (state: any) => state.user.userInfo.userAvatar,
  role: (state: any) => state.user.userInfo.roleName,
  userName: (state: any) => state.user.userInfo.userName,
  permissions: (state: any) => state.user.userInfo.permissions,
  currentMenus: (state: any) => state.menu.currentMenus,
};
export default getters
