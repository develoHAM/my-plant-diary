import { useForm } from 'react-hook-form';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../store';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// styled components
import { __SignUpButton } from '../styles/components/welcome';

export default function SignupForm() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [signupError, setSignupError] = useState('');
	const [signupSuccess, setSignupSuccess] = useState(false);
	const UserState = useSelector((state) => state.loginSlice);
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors, isDirty },
	} = useForm({ mode: 'onChange' });

	const signup = async (data) => {
		const response = await Axios.post('http://localhost:8000/user/signup', data, {
			withCredentials: true,
		});
		const { result, message, userInfo } = response.data;
		if (result) {
			dispatch(loginAction.login(userInfo));
			setSignupSuccess(true);
		} else {
			setSignupError(message);
		}
	};

	const navigateToLogin = () => {
		navigate('/welcome');
	};

	return (
		<>
			{signupSuccess ? (
				<>
					<h1>회원가입을 축하드립니다. {UserState.userInfo.name} 님</h1>
					<Link to={'/'}>홈으로 이동</Link>
				</>
			) : (
				<>
					<div>회원가입</div>
					<div>
						<form onSubmit={handleSubmit(signup)}>
							<div>
								<div>
									<label>아이디</label>
								</div>
								<input
									type='text'
									{...register('userid', {
										required: '영문, 숫자를 조합하여 입력해주세요. (8-20자)',
										pattern: {
											value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
											message: '영문, 숫자를 조합하여 입력해주세요. (8-20자)',
										},
									})}
								/>
								<div>{errors.userid?.message}</div>
							</div>
							<div>
								<div>
									<label>비밀번호</label>
								</div>
								<input
									type='password'
									{...register('password', {
										required: '영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)',
										pattern: {
											value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,16}$/,
											message: '영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)',
										},
									})}
								/>
								<div>{errors.password?.message}</div>
							</div>
							<div>
								<div>
									<label>비밀번호 확인</label>
								</div>
								<input
									type='password'
									{...register('passwordCheck', {
										required: '비밀번호가 일치하지 않습니다',
										validate: (val) => {
											if (watch('password') != val) {
												return '비밀번호가 일치하지 않습니다';
											}
										},
									})}
								/>
								<div>{errors.passwordCheck?.message}</div>
							</div>
							<div>
								<div>
									<label>이름</label>
								</div>
								<input
									type='text'
									{...register('name', {
										required: '이름이 유효하지 않습니다',
										pattern: {
											value: /^[가-힣]{2,4}(?:\s[가-힣]{2,4})?$/,
											message: '이름이 유효하지 않습니다.',
										},
									})}
								/>
								<div>{errors.name?.message}</div>
							</div>
							<div>
								<div>
									<label>이메일</label>
								</div>
								<input
									type='email'
									{...register('email', {
										required: '이메일 주소를 정확히 입력해주세요.',
										pattern: {
											value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
											message: '이메일 주소를 정확히 입력해주세요.',
										},
									})}
								/>
								<div>{errors.email?.message}</div>
							</div>
							<div>
								<__SignUpButton
									type='submit'
									disabled={
										!(
											!Object.values(watch()).includes('') &&
											Object.keys(errors).length == 0 &&
											isDirty == true
										)
									}>
									가입하기
								</__SignUpButton>
							</div>
						</form>
						<div>{signupError}</div>
					</div>
					<div>
						<button onClick={navigateToLogin}>뒤로가기</button>
					</div>
				</>
			)}
		</>
	);
}
