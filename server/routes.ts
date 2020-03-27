import * as express from 'express';

import PoolCtrl from './controllers/pool';
import UserCtrl from './controllers/user';

export default function setRoutes(app) {

  const router = express.Router();

  const poolCtrl = new PoolCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  router.route('/pools').get(poolCtrl.getAll);
  router.route('/pools/count').get(poolCtrl.count);
  router.route('/pool').post(poolCtrl.newPool);
  router.route('/pool/:id').get(poolCtrl.get);
  router.route('/pool/:id').put(poolCtrl.update);
  router.route('/pool/:id').delete(poolCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/vote').post(userCtrl.vote);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
