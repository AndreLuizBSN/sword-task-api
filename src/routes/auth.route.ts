import * as controller from '../controllers/auth.controller';
import express from 'express';
import { isAuthorized } from '../services/auth.service';

export = (() => {
        
    let router = express.Router();
          
    router.post('/', controller.login);
    router.get('/me', isAuthorized, controller.me);
    
    return router;
})();