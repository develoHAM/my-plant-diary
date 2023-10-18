import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../store';
import axios from 'axios';
import Calendar from 'react-calendar';
import moment from 'moment';

import { __MyCalendarWrapper, __MyCalendarContainer, __Calendar, __PostForm } from '../styles/components/mycalendar';
import { useForm } from 'react-hook-form';

export default function MyCalendar() {
	const UserState = useSelector((state) => state.loginSlice);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		console.log('UserState', UserState);
		const authenticateUser = async () => {
			const response = await axios.post(
				'http://localhost:8000/user/authenticate',
				{ userInfo: UserState.userInfo },
				{ withCredentials: true }
			);
			const { result, message, userInfo } = response.data;
			console.log(response.data);

			if (!result) {
				navigate('/welcome');
				return;
			}
			dispatch(loginAction.login(userInfo));
		};
		authenticateUser();
	}, []);

	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm();

	const [value, onChange] = useState(new Date());

	const submitPost = async (data, event) => {
		const { image, title, plant, content } = data;
		const file = image[0];
		const formData = new FormData();
		formData.append('title', title);
		formData.append('date', moment(value).format('YYYY-MM-DD'));
		formData.append('content', content);
		formData.append('file', file);
		const response = await axios({
			method: 'POST',
			url: 'http://localhost:8000/user/submitpost',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		console.log(response.data);
	};

	return (
		<__MyCalendarWrapper>
			<__MyCalendarContainer>
				<__Calendar>
					<Calendar
						onChange={onChange}
						value={value}
						locale='ko-KR'
						formatDay={(locale, date) => moment(date).format('DD')} // 날'일' 제외하고 숫자만 보이도록 설정
					/>
				</__Calendar>
				<__PostForm>
					<form onSubmit={handleSubmit(submitPost)}>
						<h1>기록작성</h1>
						<div>
							<input {...register('image')} id='picture' type='file' accept='image/*' />
						</div>
						<div>
							<span>날짜:</span>
							<div>{moment(value).format('YYYY-MM-DD')}</div>
						</div>
						<div>
							<span>제목:</span>
							<input type='text' {...register('title')} />
						</div>
						<div>
							<span>식물:</span>
							<input type='text' {...register('plant')} />
						</div>
						<div>
							<label>
								내용:
								<textarea {...register('content')}></textarea>
							</label>
						</div>
						<button type='submit'>제출</button>
					</form>
				</__PostForm>
			</__MyCalendarContainer>
		</__MyCalendarWrapper>
	);
}
