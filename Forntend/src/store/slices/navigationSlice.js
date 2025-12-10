import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  showUserMenu: false,
}

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    toggleUserMenu: (state) => {
      state.showUserMenu = !state.showUserMenu
    },
    openUserMenu: (state) => {
      state.showUserMenu = true
    },
    closeUserMenu: (state) => {
      state.showUserMenu = false
    },
  },
})

export const { toggleUserMenu, openUserMenu, closeUserMenu } = navigationSlice.actions

export default navigationSlice.reducer
