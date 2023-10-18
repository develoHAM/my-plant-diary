import Model from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET = 'myplantdiary';
const SALT = 10;
const controller = {};

controller.signup = async (req, res) => {
	try {
		const { userid, password, name, email } = req.body;
		const duplicatedUserid = await Model.Users.findOne({
			where: {
				userid,
			},
		});
		if (duplicatedUserid) {
			res.send({ result: false, message: '중복된 아이디' });
			return;
		}
		const encryptedPassword = bcrypt.hashSync(password, SALT);
		const userInfo = await Model.Users.create({
			userid,
			password: encryptedPassword,
			name,
			email,
			profile_pic: 'public/uploads/default.png',
		});
		if (userInfo) {
			const payload = {
				id: userInfo.id,
				userid: userInfo.userid,
			};
			const token = jwt.sign(payload, SECRET);

			res.cookie('login_token', token, {
				httpOnly: true,
				maxAge: 360000000,
			});

			res.send({ result: true, message: '가입 성공', userInfo: userInfo });
		}
	} catch (error) {
		res.send({ result: false, message: '가입 실패' });
		console.log('signup error', error);
	}
};

controller.signin = async (req, res) => {
	try {
		const { userid, password } = req.body;
		const hasUser = await Model.Users.findOne({
			where: {
				userid,
			},
		});
		if (!hasUser) {
			res.send({ result: false, message: '사용자가 존재하지 않습니다' });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, hasUser.password);
		if (!passwordMatch) {
			res.send({ result: false, message: '비밀번호가 일치하지 않습니다' });
			return;
		}
		const token = jwt.sign({ id: hasUser.id, userid: hasUser.userid }, SECRET);
		res.cookie('login_token', token, {
			httpOnly: true,
			maxAge: 360000000,
		});
		res.send({ result: true, message: '로그인 성공', userInfo: hasUser });
	} catch (error) {
		console.log('signin error', error);
	}
};

controller.update = async (req, res) => {
	try {
		const { id, userid, name, email, password, profile_pic } = req.body;

		// const duplicatedUserid = await Model.Users.findOne({
		// 	where: {
		// 		userid,
		// 	},
		// });
		// if (duplicatedUserid) {
		// 	res.send({ result: false, message: '중복된 아이디' });
		// 	return;
		// }
		const pw = await bcrypt.hash(password, SALT);
		const [updated] = await Model.Users.update(
			{
				userid,
				password: pw,
				name,
				email,
			},
			{
				where: {
					id,
				},
			}
		);
		if (updated) {
			const userInfo = await Model.Users.findOne({
				where: {
					id,
				},
			});
			const payload = {
				id: userInfo.id,
				userid: userInfo.userid,
			};
			const token = jwt.sign(payload, SECRET);
			res.cookie('login_token', token, {
				httpOnly: true,
				maxAge: 360000000,
			});
			res.send({ result: true, message: '수정 성공', userInfo: userInfo });
		}
		console.log('update complete', updated);
	} catch (error) {
		console.log('update userinfo error', error);
		res.send({ result: false, message: '수정 실패' });
	}
};

controller.updateprofilepic = async (req, res) => {
	console.log(req.file);
	const userInfo = JSON.parse(req.body.userInfo);
	console.log(userInfo);
	const [updated] = await Model.Users.update(
		{
			profile_pic: req.file.path,
		},
		{
			where: {
				id: userInfo.id,
			},
		}
	);
	if (updated) {
		const user = await Model.Users.findOne({
			where: {
				id: userInfo.id,
			},
		});
		res.send({ result: true, message: '프로필 사진 변경 성공', userInfo: user });
	}
};

controller.authenticate = async (req, res) => {
	const token = req.cookies.login_token;
	const userInfo = req.body;

	if (!token) {
		res.send({ result: false, message: '쿠키 없음' });
		return;
	}

	if (!userInfo) {
		res.send({ result: false, message: '사용자 정보 없음' });
		return;
	}

	try {
		const { id, userid } = jwt.verify(token, SECRET);
		const user = await Model.Users.findOne({
			where: {
				id: id,
				userid: userid,
			},
		});
		if (!user) {
			res.send({ result: false, message: '인증실패' });
			return;
		}
		res.send({ result: true, userInfo: user, message: '인증성공' });
	} catch (error) {
		res.send({ result: false, message: '오류 발생' });
	}
};

controller.submitpost = async (req, res) => {
	console.log('req.file', req.file);
	console.log('req.body', req.body);
	res.send({ result: true });
};

export default controller;
