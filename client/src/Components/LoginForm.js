import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// styled components
import { __Logo } from '../styles/components/welcome';

import dotenv from 'dotenv';
dotenv.config();

const env = process.env;

export default function LoginForm() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loginMessage, setLoginMessage] = useState('');
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const login = async (data) => {
		const response = await Axios.post(`${env.SERVER_DOMAIN}/user/signin`, data, {
			withCredentials: true,
		});
		const { result, message, userInfo } = response.data;
		console.log('message', message);
		if (result) {
			dispatch(loginAction.login(userInfo));
			navigate('/');
		} else {
			dispatch(loginAction.logout());
			setLoginMessage(message);
		}
	};

	const navigateToSignup = () => {
		navigate('/welcome/signup');
	};

	return (
		<>
			<div>
				<div>{loginMessage}</div>
				<form onSubmit={handleSubmit(login)}>
					<div>
						<div>
							<label>아이디</label>
						</div>
						<input type='text' {...register('userid')} />
						<div></div>
					</div>
					<div>
						<div>
							<label>비밀번호</label>
						</div>
						<input type='password' {...register('password')} />
						<div></div>
					</div>
					<div>
						<button type='submit'>로그인</button>
					</div>
				</form>
			</div>
			<div>
				<button onClick={navigateToSignup}>회원가입</button>
			</div>
		</>
	);
}
