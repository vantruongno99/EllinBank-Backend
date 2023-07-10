import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
const jwt = require('jsonwebtoken')


const errorHandler = ((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error.name === 'CastError') {
        return res.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: error.message
        })
    } else if (error.name === 'SensorError') {
        return res.status(400).json({
            error: error.message
        })

    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        })
    }
    else if (error.name === 'DuplicationError') {
        return res.status(400).json({
            error: error.message
        })
    }
    else if (error.name === 'NotFoundError') {
        return res.status(404).json({
            error: error.message
        })
    }
    next(error)
});

const unknownEndpoint = (req: Request, res: Response) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    }
    next()
}

const userExtractor = async (req: Request, response: Response, next: NextFunction) => {
    const token = req.token
    try {
        const decodedToken = jwt.verify(token, 'superSecret')
        if (!token || !decodedToken.username) {
            response.status(401).json({ error: 'token missing or invalid' })
            return;
        }
        req.user = await userService.findUserByUsername(decodedToken.username);
        next()
    }
    catch (e) {
        response.status(401).json({ error: 'token missing or invalid' })
        return;
    }

}


const adminRequire = async (req: Request, response: Response, next: NextFunction) => {
    const user = req.user
    if (user?.role !== "admin") {
        response.status(403).json({ error: 'not admin' })
        return;
    }
    next()


}

export default { errorHandler, unknownEndpoint, tokenExtractor, userExtractor, adminRequire }