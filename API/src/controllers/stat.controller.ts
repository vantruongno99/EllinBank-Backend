import { Request, Response, Router } from 'express';
import AuthService from '../services/auth.service';
import middleware from "../utils/middleware"
import StatService from '../services/stat.service';

require('express-async-errors');

const statController = Router();

statController.get('/', middleware.userExtractor, async (req: Request, res: Response) => {
    let company 
    if(req.user?.role === "user"){
        company = req.user.company
    }
    const stat = await StatService.getStat(company)
    res.status(200).json(stat)
})




export default statController
