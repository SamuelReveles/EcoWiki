const Router = require('express');
const { acceptItem, accessAdmin, getItem, deleteItem } = require('../controllers/admin');

const router = new Router();

router.get('/access', accessAdmin);
router.get('/', getItem);
router.put('/', acceptItem);
router.delete('/', deleteItem);

module.exports = router;