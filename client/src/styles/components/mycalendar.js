import styled from 'styled-components';

export const __MyCalendarWrapper = styled.main`
	width: 100vw;
	height: auto;
	margin: 0;
	background-color: #eef2e6;
`;

export const __MyCalendarContainer = styled.div`
	padding-top: 120px;
	width: 100%;
	height: inherit;
	display: flex;
	justify-content: space-between;
`;

export const __Calendar = styled.div`
	/* flex-basis: 20%; */
	padding: 0 2%;
`;

export const __PostFormContainer = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 30px;
`;

export const __FormCategory = styled.div``;

export const __LeftSide = styled.div`
	flex-basis: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 4%;
`;

export const __PostsContainer = styled.div`
	flex-basis: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100vh;
	overflow-y: scroll;
`;

export const __PostForm = styled.form`
	text-align: center;
	width: 400px;
	border: 2px solid #1c6758;
	border-radius: 15px;

	& h2 {
		color: #1c6758;
		margin: 10px 0;
	}
`;
