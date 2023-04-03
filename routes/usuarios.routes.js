const Router = require('express');
const { createItem } = require('../controllers/usuarios');

const router = new Router();

router.post('/', createItem);

module.exports = router;