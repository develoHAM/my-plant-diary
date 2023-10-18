import { __Nav, __Header, __NavGroup, __NavItem, __NavLink, __NavUserGroup } from '../styles/components/header';

export default function Header() {
	return (
		<>
			<__Header>
				<__Nav>
					<__NavGroup>
						<__NavItem>
							<__NavLink to={'/'}>Plant Diary</__NavLink>
						</__NavItem>
						<__NavItem>
							<__NavLink to={'/calendar'}>Calendar</__NavLink>
						</__NavItem>
					</__NavGroup>
					<__NavUserGroup>
						<__NavItem>
							<__NavLink to={'/mypage'}>My Page</__NavLink>
						</__NavItem>
						<__NavItem>
							<__NavLink to={'/welcome'}>로그인</__NavLink>
						</__NavItem>
						<__NavItem>
							<__NavLink to={'/welcome/signup'}>회원가입</__NavLink>
						</__NavItem>
					</__NavUserGroup>
				</__Nav>
			</__Header>
		</>
	);
}
