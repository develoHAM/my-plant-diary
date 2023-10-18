import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './models/index.js';
import userRouter from './routes/user.js';
import plantRouter from './routes/plants.js';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, extname, basename } from 'path';
import path from 'path';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/uploads/');
	},
	filename: (req, file, cb) => {
		const ext = extname(file.originalname);
		cb(null, basename(file.originalname, ext) + '_' + Date.now() + ext);
	},
});
const upload = multer({ storage });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/user', upload.single('file'), userRouter);
app.use('/plants', plantRouter);

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// app.use('*', (req, res) => {
// 	res.send({ result: false, message: '올바른 접근이 아닙니다.' });
// });

db.sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => {
		console.log(`http://localhost:${PORT}`);
	});
});
