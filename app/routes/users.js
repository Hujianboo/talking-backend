const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const { find, findById, create, update, delete: del,checkOwner, login } = require('../controllers/users');

const {secret} = require('../config')

const auth = jwt({secret})

router.get('/', find);

router.post('/', create);

router.get('/:id', findById);

router.put('/:id', auth, checkOwner, update);

router.delete('/:id', auth, checkOwner, del);

router.post('/login',login);

module.exports = router;

// {
//   "_id": "615dab25c4602aac527d86e9",
//   "name": "lilei222",
//   "passwords": "123123",
//   "__v": 0
// },