import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAction } from '../store';
import axios from 'axios';
import Calendar from 'react-calendar';
import moment from 'moment';

import {
	__MyCalendarWrapper,
	__MyCalendarContainer,
	__Calendar,
	__PostFormContainer,
	__PostsContainer,
	__PostForm,
	__LeftSide,
} from '../styles/components/mycalendar';
import { useForm } from 'react-hook-form';

let isInitial = true; // avoid-first-rendering

export default function MyCalendar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const UserState = useSelector((state) => state.loginSlice);
	const UserPosts = useSelector((state) => state.loginSlice.userInfo.posts);
	const [value, onChange] = useState(moment(Date.now()).format('YYYY-MM-DD'));
	const EventDates = UserPosts?.map((post) => post.date);
	console.log('EventDates', EventDates);
	const postsForDate = UserPosts?.filter((post) => moment(value).format('YYYY-MM-DD') == post.date);
	console.log('postsForDate', postsForDate);

	// UserState.userInfo.posts?.map((post) => post.date);

	useEffect(() => {
		console.log('UserState', UserState);
		const authenticateUser = async () => {
			const response = await axios.post(
				'my-plant-diary-server:8000/user/authenticate',
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

	const submitPost = async (data, event) => {
		event.preventDefault();
		console.log('submitttttttttttttt');
		const { image, title, plant, content } = data;
		const file = image[0];
		const formData = new FormData();
		formData.append('title', title);
		formData.append('plant', plant);
		formData.append('date', moment(value).format('YYYY-MM-DD'));
		formData.append('content', content);
		formData.append('file', file);
		const response = await axios({
			method: 'POST',
			url: 'my-plant-diary-server:8000/user/submitpost',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			withCredentials: true,
		});
		const { result, message, userInfo, createdPost } = response.data;
		if (result) {
			dispatch(loginAction.login(userInfo));
			console.log('createdPost', createdPost);
		} else {
			console.log('message', message);
		}
	};

	console.log('errors', errors);
	console.log('watch', watch());
	return (
		<__MyCalendarWrapper>
			<__MyCalendarContainer>
				<__LeftSide>
					<__Calendar>
						<Calendar
							onChange={onChange}
							value={value}
							locale='ko-KR'
							formatDay={(locale, date) => moment(date).format('DD')}
							minDate={new Date(2020, 1, 1)}
							maxDate={new Date(2050, 1, 1)}
							minDetail={'year'}
							tileContent={({ date, view }) => {
								if (EventDates?.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
									return (
										<>
											<div className='dot-container'>
												<div className='dot'></div>
											</div>
										</>
									);
								}
							}}
						/>
					</__Calendar>
					<__PostFormContainer>
						<__PostForm onSubmit={handleSubmit(submitPost)}>
							<h2>일지 작성하기</h2>
							<div>
								<div>사진:</div>
								<input {...register('image', { value: '' })} id='image' type='file' accept='image/*' />
							</div>
							<div>
								<div>날짜:</div>
								<div>{moment(value).format('YYYY-MM-DD')}</div>
							</div>
							<div>
								<div>제목:</div>
								<input type='text' {...register('title')} />
							</div>
							<div>
								<div>식물:</div>
								<input type='text' {...register('plant')} />
							</div>
							<div>
								<label>
									<div>내용:</div>
									<textarea {...register('content')}></textarea>
								</label>
							</div>
							<button type='submit' disabled={Object.values(watch()).includes('')}>
								제출
							</button>
						</__PostForm>
					</__PostFormContainer>
				</__LeftSide>
				<__PostsContainer>
					{UserPosts &&
						postsForDate?.map((post) => (
							<div key={post.id}>
								<div>
									<div>제목: {post.title}</div>
								</div>
								<div>
									<div>반려식물 이름: {post.plant}</div>
								</div>
								<div>
									<div>내용: {post.content}</div>
								</div>
								<div>
									<img src={post.img} />
								</div>
							</div>
						))}
				</__PostsContainer>
			</__MyCalendarContainer>
		</__MyCalendarWrapper>
	);
}
