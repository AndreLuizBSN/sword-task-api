import * as controller from '../controllers/task.controller';
import express from 'express';
import { isAuthorized, isManager, isTech } from '../services/auth.service';

export = (() => {
        
    let router = express.Router();
          
    router.get('/', isAuthorized, controller.all);
    router.get('/:id', isAuthorized, controller.show);
    router.post('/', isAuthorized, isTech, controller.create);
    router.put('/:id', isAuthorized, isTech, controller.update);
    router.delete('/:id', isAuthorized, isManager, controller.drop);
    
    return router;
})();