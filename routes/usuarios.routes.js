const Router = require('express');
const { createItem, getItem, getAllCategories, editItem } = require('../controllers/usuarios');

const router = new Router();

router.post('/', createItem);
router.get('/', getItem);
router.put('/', editItem);
router.get('/category/', getAllCategories);

module.exports = router;