import { Outlet, useNavigate } from 'react-router-dom';
import { __LoginWrapper, __LoginContainer, __Logo } from '../styles/components/welcome';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function Welcome() {
	const UserState = useSelector((state) => state.loginSlice);
	const navigate = useNavigate();

	useEffect(() => {
		if (UserState.isLoggedIn) {
			navigate('/mypage');
		}
	}, []);

	return (
		<__LoginWrapper>
			<__LoginContainer>
				<__Logo>My Plant Diary</__Logo>
				<Outlet />
			</__LoginContainer>
		</__LoginWrapper>
	);
}
