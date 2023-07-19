import { Request, Response, Router } from 'express';
import companyService from '../services/company.service';
import middleware from "../utils/middleware"
import { CompanyInfo, CompanyInput, CompanyQueryOption } from '../models/company.modal';

require('express-async-errors');

const companyRouter = Router();
companyRouter.use(middleware.userExtractor)


companyRouter.post('/', async (req: Request, res: Response) => {
    const input: CompanyInput = req.body
    const newTask = await companyService.createCompany(input)
    res.status(200).json(newTask)
})

companyRouter.get('/', async (req: Request, res: Response) => {
    const sensors = await companyService.getAllCompany()
    res.status(200).json(sensors)
})

companyRouter.get('/:companyName/info', async (req: Request, res: Response) => {
    const companyName = req.params.companyName
    const query: CompanyQueryOption = req.body
    const company = await companyService.getAllCompanyData(companyName,query)
    res.status(200).json(company)
})

companyRouter.get('/:companyName', async (req: Request, res: Response) => {
    const companyName = req.params.companyName
    const company = await companyService.getCompany(companyName)
    res.status(200).json(company)
})

export default companyRouter
