import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './models/index.js';
import userRouter from './routes/user.js';
import plantRouter from './routes/plants.js';
import multer from 'multer';
import AWS from 'aws-sdk';
import multers3 from 'multer-s3-transform';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, extname, basename } from 'path';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env;
const app = express();
const PORT = env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

AWS.config.update({
	accessKeyId: env.S3_ID,
	secretAccessKey: env.S3_KEY,
	region: env.S3_REGION,
});

const localStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/uploads/');
	},
	filename: (req, file, cb) => {
		const extension = extname(file.originalname);
		const name = basename(file.originalname, ext);
		cb(null, `${Date.now()}_${name}${extension}`);
	},
});

const S3Storage = multers3({
	s3: new AWS.S3(),
	bucket: env.S3_BUCKET,
	contentType: multers3.AUTO_CONTENT_TYPE,
	acl: 'public-read',
	shouldTransform: true,
	transforms: [
		{
			id: 'resized',
			key: function (req, file, cb) {
				const extension = path.extname(file.originalname);
				const name = basename(file.originalname, extension);
				cb(null, `uploads/${Date.now()}_${name}${extension}`);
			},
			transform: function (req, file, cb) {
				cb(null, sharp().resize(500, 500, { fit: 'inside' }));
			},
		},
	],
});

const upload =
	process.env.NODE_ENV == 'development' ? multer({ storage: localStorage }) : multer({ storage: S3Storage });

const uploadImageMulterMiddleware = upload.single('file');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/user', uploadImageMulterMiddleware, userRouter);
app.use('/plants', plantRouter);

app.use('*', (req, res) => {
	res.send({ result: false, message: '올바른 접근이 아닙니다.' });
});

db.sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		console.log(`http://localhost:${PORT}`);
	});
});

// app.use('/', express.static(path.join(__dirname, '../client/build')));
// app.get('/', function (req, res) {
// 	res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
// app.get('*', function (req, res) {
// 	res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });
