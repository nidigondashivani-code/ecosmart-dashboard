import express from 'express';
import { getWaste, getPollution, getWater, getScore, getRecommendations } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/waste', getWaste);
router.get('/pollution', getPollution);
router.get('/water', getWater);
router.get('/score', getScore);
router.get('/recommendations', getRecommendations);

export default router;
