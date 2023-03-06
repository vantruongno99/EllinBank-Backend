import { RegisterInput, LoginInput } from "../models/auth.modal"
import bcrypt from 'bcrypt'
import { prisma } from "../../prisma/prismaClient"
import { UserProfile } from "../models/user.modal"

const createUser = async (register: RegisterInput) => {
  const email = register.email.trim()
  const password = register.password.trim()
  const username = register.username.trim()

  if (!email) {
    throw ({ name: 'ValidationError', message: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw ({ name: 'ValidationError', message: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw ({ name: 'ValidationError', message: { password: ["can't be blank"] } });
  }
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword
      }
    });
    return user
  }
  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }

  }
}

const findAllUser = async ()=> {
  const users = await prisma.user.findMany()
  return users;
}


const findUserByUsername = async (username: string) : Promise<any> => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      id: true,
    },
  });

  if (!user) {
    throw ({ name: 'JsonWebTokenError' });
  }
  return user;
}

export default { createUser, findAllUser, findUserByUsername }
