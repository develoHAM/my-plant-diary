import Model from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

dotenv.config();

const env = process.env;

const SECRET = env.SECRET;
const SALT = Number(env.SALT);
const controller = {};

const S3 = new AWS.S3({
	accessKeyId: env.S3_ID,
	secretAccessKey: env.S3_KEY,
	region: env.S3_REGION,
});

controller.signup = async (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
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
		});
		if (userInfo) {
			const payload = {
				id: userInfo.id,
				userid: userInfo.userid,
			};
			const token = jwt.sign(payload, SECRET);
			res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
			res.header('Access-Control-Allow-Credentials', 'true');
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
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
	try {
		const { userid, password } = req.body;
		const user = await Model.Users.findOne({
			where: {
				userid,
			},
		});
		if (!user) {
			res.send({ result: false, message: '사용자가 존재하지 않습니다' });
			return;
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			res.send({ result: false, message: '비밀번호가 일치하지 않습니다' });
			return;
		}
		const posts = user.getPosts();
		const data = {
			account: user,
			posts: posts,
		};
		const token = jwt.sign({ id: user.id, userid: user.userid }, SECRET);
		res.cookie('login_token', token, {
			httpOnly: true,
			maxAge: 360000000,
		});
		res.send({ result: true, message: '로그인 성공', userInfo: data });
	} catch (error) {
		console.log('signin error', error);
	}
};

controller.update = async (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
	try {
		const { id, userid, name, email, password, profile_pic } = req.body;
		const pw = bcrypt.hashSync(password, SALT);
		console.log('pw', pw);
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
			const user = await Model.Users.findOne({
				where: {
					id,
				},
			});
			const posts = await user.getPosts();
			const data = {
				account: user,
				posts: posts,
			};
			const payload = {
				id: user.id,
				userid: user.userid,
			};
			const token = jwt.sign(payload, SECRET);
			res.cookie('login_token', token, {
				httpOnly: true,
				maxAge: 360000000,
			});
			res.send({ result: true, message: '수정 성공', userInfo: data });
		}
		console.log('update complete', updated);
	} catch (error) {
		console.log('update userinfo error', error);
		res.send({ result: false, message: '수정 실패' });
	}
};

controller.updateprofilepic = async (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
	try {
		const path = req.file.path || req.file.transforms[0].location;
		console.log('path', path);
		const userInfo = JSON.parse(req.body.userInfo);
		console.log('req.file', req.file);
		console.log('userInfo', userInfo);

		const { profile_pic } = await Model.Users.findOne({
			where: {
				id: userInfo.id,
			},
		});
		if (profile_pic != env.DEFAULT_PROFILE_IMG_SRC) {
			console.log('file that needs to be deleted', profile_pic);
			const url = new URL(profile_pic);
			const Key = url.pathname.substring(1);
			const params = {
				Bucket: env.S3_BUCKET,
				Key: Key,
			};

			S3.deleteObject(params, (error, data) => {
				if (error) {
					console.log('delete S3 object error', error);
				} else {
					console.log('delete S3 object success', data);
				}
			});
		}

		const [updated] = await Model.Users.update(
			{
				profile_pic: path,
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
			const posts = await user.getPosts();
			const data = {
				account: user,
				posts: posts,
			};
			res.send({ result: true, message: '프로필 사진 변경 성공', userInfo: data });
		}
	} catch (error) {
		console.log('error updating profilepic', error);
		res.send({ result: false, message: '프로필 사진 변경 실패' });
	}
};

controller.authenticate = async (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
	try {
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
		const posts = await user.getPosts();
		const data = {
			account: user,
			posts: posts,
		};
		console.log('posts', posts);
		res.send({ result: true, userInfo: data, message: '인증성공' });
	} catch (error) {
		console.log(error);
		res.send({ result: false, message: '오류 발생' });
	}
};

controller.submitpost = async (req, res) => {
	res.header('Access-Control-Allow-Origin', 'https://web-my-plant-diary-jvpb2alnwnvncg.sel5.cloudtype.app');
	res.header('Access-Control-Allow-Credentials', 'true');
	const path = req.file.path || req.file.transforms[0].location;
	const token = req.cookies.login_token;
	console.log('req.file', req.file);
	console.log('req.body', req.body);
	if (!token) {
		res.send({ result: false, message: '토큰 없음' });
		return;
	}
	const { id, userid } = jwt.verify(token, SECRET);
	const { title, date, content, plant } = req.body;

	const post = await Model.Posts.create({
		title: title,
		plant: plant,
		content: content,
		img: path,
		date: date,
		user_id: id,
	});

	const user = await Model.Users.findOne({
		where: {
			id: id,
		},
	});

	const posts = await user.getPosts();

	const data = {
		account: user,
		posts: posts,
	};
	console.log('post', post);
	res.send({ result: true, message: '포스트 저장완료', userInfo: data, createdPost: post });
};

controller.updatepost = async (req, res) => {};

export default controller;
