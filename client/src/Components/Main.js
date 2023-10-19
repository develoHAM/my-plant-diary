import { Link } from 'react-router-dom';
import { __MainWrapper, __MainTitle, __Link } from '../styles/components/main';

export default function Main() {
	return (
		<__MainWrapper>
			<__Link to={'/calendar'}>
				<__MainTitle>지금 바로 일지를 작성해보세요</__MainTitle>
			</__Link>
		</__MainWrapper>
	);
}
