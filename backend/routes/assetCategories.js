const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assetCategories');

router.get('/', ctrl.getAllCategories);
router.get('/:id', ctrl.getCategoryById);
router.post('/', ctrl.createCategory);
router.put('/:id', ctrl.updateCategory);

module.exports = router; 