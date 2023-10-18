import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Welcome from '../Components/Welcome';
import Main from '../Components/Main';
import MyPage from '../Components/MyPage';
import LoginForm from '../Components/LoginForm';
import SignupForm from '../Components/SignupForm';
import Error from '../Components/Error';
import MyCalendar from '../Components/Calendar';

const Router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Main />,
			},
			{
				path: 'mypage',
				element: <MyPage />,
			},
			{
				path: 'calendar',
				element: <MyCalendar />,
			},
		],
		errorElement: <Error />,
	},
	{
		path: '/welcome',
		element: <Welcome />,
		children: [
			{
				index: true,
				element: <LoginForm />,
			},
			{
				path: 'signup',
				element: <SignupForm />,
			},
		],
		errorElement: <Error />,
	},
]);

export default Router;
