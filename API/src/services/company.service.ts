import { TaskEditInput, TaskInput } from "../models/task.model"
import { prisma } from "../../prisma/prismaClient"
import { ConfigSend } from "../models/mqtt.modals";
import mqttService from "./mqtt.service";
import errorHandler from "../utils/errorHandler"
import redisClient from "../redis/redisClient";
import { CompanyInput, CompanyQueryOption } from "../models/company.modal";


const createCompany = async (company: CompanyInput) => {

  try {
    const newCompany = await prisma.company.create({
      data: {
        ...company
      }
    })
    return newCompany

  }
  catch (e: any) {
    errorHandler(e)
  }
}

const getAllCompany = async () => {
  try {
    return await prisma.company.findMany()
  }
  catch (e: any) {
    errorHandler(e)
  }
}


const getCompany = async (name: string) => {
  try {

    const company = await prisma.company.findFirstOrThrow({
      where: {
        name: name
      },
      include: {
        Users: true
      }
    })

    return company

  }
  catch (e: any) {
    errorHandler(e)
  }
}

const getUser = async (name: string) => {
  try {
    const company = await prisma.company.findFirstOrThrow({
      where: {
        name: name
      },
      include: {
        Users: true
      }
    })

    return company.Users

  }
  catch (e: any) {
    errorHandler(e)
  }
}

const getAllCompanyData = async (name: string, option: CompanyQueryOption) => {

  const from = option.from ? new Date(option.from) : null
  const to = option.to ? new Date(option.to) : null


  try {
    const company = await prisma.company.findFirstOrThrow({
      where: {
        name: name
      },
      include: {
        Users: true,
        Tasks: {
          where: {
            startTime: {
              ...(from && {
                gte: from
              })
            },
            endTime: {
              ...(to && {
                lte: to
              })
            },
          },
          include: {
            Device: {
              select: {
                Device: true
              }
            }
          },
        },
      }
    })

    return company

  }
  catch (e: any) {
    errorHandler(e)
  }
}



export default {
  createCompany,
  getAllCompany,
  getUser,
  getCompany,
  getAllCompanyData
}
