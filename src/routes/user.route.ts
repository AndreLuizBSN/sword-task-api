import * as controller from '../controllers/user.controller';
import express from 'express';
import { isAuthorized, isManager } from '../services/auth.service';
import { UserType } from '../interfaces/user.interface';


export = (() => {
        
    let router = express.Router();
          
    router.get('/', isAuthorized, isManager, controller.all);
    router.get('/:id', isAuthorized, isManager, controller.show);
    router.post('/', isAuthorized, isManager, controller.create);
    router.put('/:id', isAuthorized, isManager, controller.update);
    router.delete('/:id', isAuthorized, isManager, controller.drop);
    
    return router;
})();