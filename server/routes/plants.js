import express from 'express';
import axios from 'axios';
import { toJson, toXml } from 'xml2json';
import Model from '../models/index.js';

const router = express.Router();
const KEY = '20231013FJZENZOB84CP9IYBVCJSW';
let options = {
	object: false, //반환할 json형식이 객체인지, 문자열인지
	reversible: false,
	coerce: false,
	sanitize: true,
	trim: true,
	arrayNotation: false,
	alternateTextNode: false,
};

router.get('/getall', async (req, res) => {
	const { data } = await axios.get('http://api.nongsaro.go.kr/service/garden/gardenList', {
		params: {
			apiKey: KEY,
			numOfRows: 1000,
		},
	});

	const xmlDocument = toJson(data, options);
	const parsed = JSON.parse(xmlDocument);
	const { item, numOfRows, pageNo, totalCount } = parsed.response.body.items;
	let plantInfo = [];
	for (const plant of item) {
		plantInfo.push({ id: plant.cntntsNo, name_ko: plant.cntntsSj });
	}
	plantInfo.forEach((plant) => {
		Model.Plants.create({
			id: plant.id,
			name_ko: plant.name_ko,
		});
	});
	res.send(plantInfo);
});

export default router;
