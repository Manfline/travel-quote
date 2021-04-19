const router = require('express').Router();
const controller = require('./controller');

router.get('/:from/:to', (req, res) => controller.get(req, res));
router.post('/', (req, res) => controller.post(req, res));

module.exports = router;
