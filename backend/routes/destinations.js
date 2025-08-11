const express = require('express');
const router = express.Router();
const destController = require('../controllers/destinationsController');
const auth = require('../middleware/authMiddleware');

router.get('/', destController.getAll);
router.get('/:id', destController.getById);
router.post('/', auth, destController.create);
router.put('/:id', auth, destController.update);
router.delete('/:id', auth, destController.remove);

module.exports = router;