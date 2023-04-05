const Router = require('express');
const { createItem, getItem, getAllCategories } = require('../controllers/usuarios');

const router = new Router();

router.post('/', createItem);
router.get('/', getItem);
router.get('/category/', getAllCategories);

module.exports = router;