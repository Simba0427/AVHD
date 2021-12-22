const state = () => {
  return {
    menu: [
      {
        icon: "HomeIcon",
        pageName: "side-menu-dashboard",
        title: "Dashboard",
        subMenu: [
          {
            icon: "",
            pageName: "side-menu-panel",
            title: "Panel 1"
          }
        ]
      },
      {
        icon: "UsersIcon",
        pageName: "side-menu-users",
        title: "Handlers",
        subMenu: [
          {
            icon: "",
            pageName: "side-menu-users-handlers",
            title: "Handlers"
          },
          {
            icon: "",
            pageName: "side-menu-users-groups",
            title: "Groups"
          }
        ]
      }
    ]
  };
};

// getters
const getters = {
  menu: (state) => state.menu
};

// actions
const actions = {};

// mutations
const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
