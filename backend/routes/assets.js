const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assets');

router.get('/', ctrl.getAllAssets);
router.get('/:id', ctrl.getAssetById);
router.post('/', ctrl.createAsset);
router.put('/:id', ctrl.updateAsset);
router.delete('/:id', ctrl.deleteAsset);
router.post('/:id/checkout', ctrl.checkoutAsset);
router.post('/:id/checkin', ctrl.checkinAsset);

module.exports = router; 