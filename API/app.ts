import express, { NextFunction, Request, Response } from 'express';
import {json} from 'body-parser'
import cors from 'cors'
import morganBody from 'morgan-body'
import routes from './src/routes/routes'
import middleware from './src/utils/middleware';

const compression = require('compression')
const app = express()
app.use(cors())
app.use(json())
app.use(compression())
morganBody(app)

app.use(middleware.tokenExtractor)

app.get('/', (req: Request, res: Response) => {
    res.json({ status: 'API is running on /api' });
  });


app.use(routes)
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);


export default app 