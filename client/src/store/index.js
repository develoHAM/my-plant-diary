import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialLoginState = { isLoggedIn: false, userInfo: {} };

const loginSlice = createSlice({
	name: 'login',
	initialState: initialLoginState,
	reducers: {
		login(state, action) {
			const userInfo = action.payload;
			state.isLoggedIn = true;
			state.userInfo = userInfo;
		},
		logout(state) {
			state.isLoggedIn = false;
			state.userInfo = {};
		},
	},
});

const store = configureStore({
	reducer: { loginSlice: loginSlice.reducer },
});

export const loginAction = loginSlice.actions;

export default store;
