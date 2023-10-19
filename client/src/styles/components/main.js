import styled from 'styled-components';
import mainImgSrc from '../../img/main.jpg';
import { Link } from 'react-router-dom';

export const __MainWrapper = styled.main`
	background: url(${mainImgSrc}) no-repeat center center fixed;
	background-size: cover;
	width: 100%;
	height: 100vh;
	padding-top: 80px;
`;

export const __Link = styled(Link)`
	text-decoration: none;
	color: #eef2e6;
`;

export const __MainTitle = styled.h1`
	padding-top: 120px;
	/* position: fixed; */
	display: flex;
	justify-content: center;
`;
