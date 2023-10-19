import { __MyPageWrapper } from '../styles/components/mypage';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { loginAction } from '../store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MyPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const UserState = useSelector((state) => state.loginSlice);
	const UserInfo = UserState.userInfo.account;
	const [pageLoaded, setPageLoaded] = useState(false);
	const [file, setFile] = useState(null);
	const [path, setPath] = useState(null);
	const [isEditing, setIsEditing] = useState({ name: false, email: false, userid: false, password: false });
	const {
		handleSubmit,
		register,
		unregister,
		watch,
		formState: { errors },
	} = useForm({ mode: 'onChange' });

	useEffect(() => {
		console.log('UserState', UserState);
		console.log('UserInfo', UserInfo);
		const authenticateUser = async () => {
			const response = await axios.post(
				'https://port-0-my-plant-diary-server-jvpb2alnwnvncg.sel5.cloudtype.app/user/authenticate',
				{ userInfo: UserInfo },
				{ withCredentials: true }
			);
			const { result, message, userInfo } = response.data;
			console.log(response.data);

			if (!result) {
				navigate('/welcome');
				return;
			}
			setPageLoaded(true);
			dispatch(loginAction.login(userInfo));
			setPath(userInfo.account.profile_pic);
		};
		authenticateUser();
	}, []);

	const updateProfilePic = async (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('userInfo', JSON.stringify(UserInfo));
		formData.append('file', file);
		const { data } = await axios({
			method: 'POST',
			url: 'https://port-0-my-plant-diary-server-jvpb2alnwnvncg.sel5.cloudtype.app/user/updateprofilepic',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		const { result, message, userInfo } = data;
		if (result) {
			console.log('userInfo', userInfo);
			dispatch(loginAction.login(userInfo));
			setPath(userInfo.account.profile_pic);
		} else {
			console.log(message);
		}
	};

	const submitUpdateUserInfo = async (data, event) => {
		const updateTarget = event.target[0].name;
		const payload = { ...UserInfo };
		payload[updateTarget] = watch(updateTarget);
		console.log('payload', payload);
		const response = await axios.post(
			'https://port-0-my-plant-diary-server-jvpb2alnwnvncg.sel5.cloudtype.app/user/update',
			payload,
			{ withCredentials: true }
		);
		const { result, message, userInfo } = response.data;
		if (result) {
			dispatch(loginAction.login(userInfo));
			const newEditingState = { ...isEditing };
			newEditingState[updateTarget] = !isEditing[updateTarget];
			setIsEditing(newEditingState);
		} else {
			console.log(message);
		}
	};

	const toggleEdit = (event, target) => {
		event.preventDefault();
		console.log('toggleEdit event', event);
		console.log('toggleEdit target', target);
		if (isEditing[target] == true) {
			unregister(target);
		}
		const newEditingState = { ...isEditing };
		newEditingState[target] = !isEditing[target];
		setIsEditing(newEditingState);
	};
	return (
		<>
			{pageLoaded && (
				<__MyPageWrapper>
					<div>
						<h1>내 프로필</h1>
						<div>
							<div>
								<img src={path} />
							</div>
							<div>
								<form encType='multipart/form-data' onSubmit={updateProfilePic}>
									<input
										type='file'
										name='file'
										onChange={(event) => setFile(event.target.files[0])}
									/>
									<button type='submit'>업로드</button>
								</form>
							</div>
							<div>
								<div>
									<form onSubmit={handleSubmit(submitUpdateUserInfo)}>
										<label>이름:</label>
										{isEditing.name ? (
											<div>
												<input
													type='text'
													name='name'
													{...register('name', {
														value: UserInfo.name,
														required: '이름이 유효하지 않습니다',
														pattern: {
															value: /^[가-힣]{2,4}(?:\s[가-힣]{2,4})?$/,
															message: '이름이 유효하지 않습니다.',
														},
													})}
												/>
												<p>{errors.name?.message}</p>
												<button type='submit' disabled={errors.name}>
													변경 완료
												</button>
												<button type='button' onClick={(event) => toggleEdit(event, 'name')}>
													취소
												</button>
											</div>
										) : (
											<div>
												<span>{UserInfo.name}</span>
												<button type='button' onClick={(event) => toggleEdit(event, 'name')}>
													변경
												</button>
											</div>
										)}
									</form>
								</div>
								<div>
									<form onSubmit={handleSubmit(submitUpdateUserInfo)}>
										<label>아이디:</label>
										{isEditing.userid ? (
											<div>
												<input
													type='text'
													name='userid'
													{...register('userid', {
														value: UserInfo.userid,
														required: '영문, 숫자를 조합하여 입력해주세요. (8-20자)',
														pattern: {
															value: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
															message: '영문, 숫자를 조합하여 입력해주세요. (8-20자)',
														},
													})}
												/>
												<p>{errors.userid?.message}</p>
												<button type='submit' disabled={errors.userid}>
													변경 완료
												</button>
												<button type='button' onClick={(event) => toggleEdit(event, 'userid')}>
													취소
												</button>
											</div>
										) : (
											<div>
												<span>{UserInfo.userid}</span>
												<button type='button' onClick={(event) => toggleEdit(event, 'userid')}>
													변경
												</button>
											</div>
										)}{' '}
									</form>
								</div>
								<div>
									<form onSubmit={handleSubmit(submitUpdateUserInfo)}>
										<label>비밀번호:</label>
										{isEditing.password ? (
											<div>
												<input
													type='password'
													name='password'
													{...register('password', {
														required:
															'영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)',
														pattern: {
															value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,16}$/,
															message:
																'영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)',
														},
													})}
												/>
												<p>{errors.password?.message}</p>
												<button type='submit' disabled={errors.password}>
													변경 완료
												</button>
												<button
													type='button'
													onClick={(event) => toggleEdit(event, 'password')}>
													취소
												</button>
											</div>
										) : (
											<div>
												<span>비번비번</span>
												<button
													type='button'
													onClick={(event) => toggleEdit(event, 'password')}>
													변경
												</button>
											</div>
										)}{' '}
									</form>
								</div>
								<div>
									<form onSubmit={handleSubmit(submitUpdateUserInfo)}>
										<label>이메일:</label>
										{isEditing.email ? (
											<div>
												<input
													type='text'
													name='email'
													{...register('email', {
														value: UserInfo.email,
														required: '이메일 주소를 정확히 입력해주세요.',
														pattern: {
															value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
															message: '이메일 주소를 정확히 입력해주세요.',
														},
													})}
												/>
												<p>{errors.email?.message}</p>
												<button type='submit' disabled={errors.email}>
													변경 완료
												</button>
												<button type='button' onClick={(event) => toggleEdit(event, 'email')}>
													취소
												</button>
											</div>
										) : (
											<div>
												<span>{UserInfo.email}</span>
												<button type='button' onClick={(event) => toggleEdit(event, 'email')}>
													변경
												</button>
											</div>
										)}{' '}
									</form>
								</div>
							</div>
						</div>
					</div>
				</__MyPageWrapper>
			)}
		</>
	);
}

/* 
			<div>
				<div>
					{isEditing.name ? (
						<>
							<form onSubmit={handleSubmit(updateName)}>
								<input {...register('name', { required: '필수임다' })} />
								<button type='submit'>수정완료</button>
							</form>
							<div>{errors.name?.message}</div>
							<button onClick={() => setIsEditing({ ...isEditing, name: false })}>취소</button>
						</>
					) : (
						<>
							<p>{name}</p>
							<button onClick={() => setIsEditing({ ...isEditing, name: true })}>변경</button>
						</>
					)}
				</div>
				<div>
					{isEditing.email ? (
						<>
							<form onSubmit={handleSubmit(updateEmail)}>
								<input {...register('email', { required: '필수임다' })} />
								<button type='submit'>수정완료</button>
							</form>
							<div>{errors.email?.message}</div>
							<button onClick={() => setIsEditing({ ...isEditing, email: false })}>취소</button>
						</>
					) : (
						<>
							<p>{email}</p>
							<button onClick={() => setIsEditing({ ...isEditing, email: true })}>변경</button>
						</>
					)}
				</div>
				<div>
					{isEditing.userid ? (
						<>
							<form onSubmit={handleSubmit(updateUserid)}>
								<input {...register('userid', { required: '필수임다' })} />
								<button type='submit'>수정완료</button>
							</form>
							<div>{errors.userid?.message}</div>
							<button onClick={() => setIsEditing({ ...isEditing, userid: false })}>취소</button>
						</>
					) : (
						<>
							<p>{userid}</p>
							<button onClick={() => setIsEditing({ ...isEditing, userid: true })}>변경</button>
						</>
					)}
				</div>
				<div>
					{isEditing.password ? (
						<>
							<form onSubmit={handleSubmit(updatePassword)}>
								<input {...register('password', { required: '필수임다' })} />
								<button type='submit'>수정완료</button>
							</form>
							<div>{errors.password?.message}</div>
							<button onClick={() => setIsEditing({ ...isEditing, password: false })}>취소</button>
						</>
					) : (
						<>
							<p>{password}</p>
							<button onClick={() => setIsEditing({ ...isEditing, password: true })}>변경</button>
						</>
					)}
				</div>
			</div>
*/

/* 
	const [isEditing, setIsEditing] = useState({ name: false, email: false, userid: false, password: false });
	
	const updateName = async (data) => {
		const newUserInfo = {
			id,
			name: data.name,
			userid,
			email,
			password,
		};
		const response = await axios.post('http://localhost:8000/user/update', newUserInfo, { withCredentials: true });
		const { result, message, userInfo } = response.data;
		dispatch(loginAction.login(userInfo));
		setIsEditing({ ...isEditing, name: false });
	};
	const updateEmail = async (data) => {
		const newUserInfo = {
			id,
			name,
			userid,
			email: data.email,
			password,
		};
		const response = await axios.post('http://localhost:8000/user/update', newUserInfo, { withCredentials: true });
		const { result, message, userInfo } = response.data;
		dispatch(loginAction.login(userInfo));
		setIsEditing({ ...isEditing, email: false });
	};
	const updateUserid = async (data) => {
		const newUserInfo = {
			id,
			name,
			userid: data.userid,
			email,
			password,
		};
		const response = await axios.post('http://localhost:8000/user/update', newUserInfo, {
			withCredentials: true,
		});
		const { result, message, userInfo } = response.data;
		dispatch(loginAction.login(userInfo));
		setIsEditing({ ...isEditing, userid: false });
	};
	const updatePassword = async (data) => {
		const newUserInfo = {
			id,
			name,
			userid,
			email,
			password: password,
		};
		const response = await axios.post('http://localhost:8000/user/update', newUserInfo, {
			withCredentials: true,
		});
		const { result, message, userInfo } = response.data;
		dispatch(loginAction.login(userInfo));
		setIsEditing({ ...isEditing, password: false });
	};
*/
