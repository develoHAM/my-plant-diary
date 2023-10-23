import express from 'express';
import controller from '../controller/controller_user.js';
const router = express.Router();

router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/update', controller.update);
router.post('/updateprofilepic', controller.updateprofilepic);
router.post('/authenticate', controller.authenticate);
router.post('/submitpost', controller.submitpost);

export default router;
