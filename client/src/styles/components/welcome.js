import styled from 'styled-components';
import forestImgSrc from '../../img/1.jpg';

export const __LoginWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	background: url(${forestImgSrc}) no-repeat center center fixed;
	background-size: cover;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const __LoginContainer = styled.div`
	width: 30%;
	height: 60%;
	background-color: #eef2e6;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const __Logo = styled.div`
	font-size: 30px;
	font-weight: 900;
	margin-top: 5%;
	margin-bottom: auto;
`;

export const __SignInButton = styled.button`
	width: 60%;
	height: 10%;
	background-color: #3d8361;
	color: whitesmoke;
	border: none;
	border-radius: 10px;
	margin-bottom: 0.5rem;

	&:hover {
		background-color: #1c6758;
	}
`;

export const __SignUpButton = styled.button`
	width: 60%;
	height: 10%;
	background-color: #d6cda4;
	color: #333333;
	border: none;
	border-radius: 10px;
	margin-bottom: 5%;

	&:disabled {
		background-color: black;
	}

	&:hover {
		background-color: #c6ba81;
	}
`;
