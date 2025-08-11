const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const auth = require('../middleware/authMiddleware');

router.get('/', postsController.getAll);
router.get('/:id', postsController.getById);
router.post('/', auth, postsController.create);
router.put('/:id', auth, postsController.update);
router.delete('/:id', auth, postsController.remove);

module.exports = router;