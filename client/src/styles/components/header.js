import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const __Header = styled.header`
	background-color: #1c6758;
	position: fixed;
	top: 0;
	width: 100%;
	height: 80px;
`;

export const __Nav = styled.nav`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1.2rem;
`;

export const __NavGroup = styled.div`
	flex-basis: 30%;
	display: flex;
	justify-content: space-evenly;
`;

export const __NavUserGroup = styled.div`
	flex-basis: 20%;
	display: flex;
	justify-content: space-evenly;
`;

export const __NavItem = styled.div``;

export const __NavLink = styled(Link)`
	text-decoration: none;
	color: white;
`;
