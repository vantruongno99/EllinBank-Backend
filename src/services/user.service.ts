import { RegisterInput, LoginInput } from "../models/auth.modal"
import bcrypt from 'bcrypt'
import { prisma } from "../../prisma/prismaClient"
import { User, UserEditInput, UserSelect, UserUpdate } from "../models/user.modal"
import errorHandler from "../utils/errorHandler"

const createUser = async (register: RegisterInput): Promise<User | undefined> => {
  const email: string = register.email.trim()
  const password: string = register.password.trim()
  const username: string = register.username.trim()
  const company: string | undefined = register?.company
  const role: string | undefined = register?.role

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
        hashedPassword,
        role,
        company
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

const findAllUser = async (): Promise<UserSelect[] | undefined> => {
  const users = await prisma.user.findMany(
    {
      select: {
        username: true,
        id: true,
        email: true,
        role: true,
        company: true,
      }
    }
  )
  return users;
}


const findUserByUsername = async (username: string): Promise<UserSelect> => {

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      id: true,
      email: true,
      role: true,
      company: true
    },
  });

  if (!user) {
    throw ({ name: 'JsonWebTokenError' });
  }
  return user;
}

const deleteUser = async (username: string): Promise<void> => {
  try {
    await prisma.user.delete({
      where: {
        username,
      }
    });
  }
  catch (e) {
    errorHandler(e)
  }
}

const editUser = async (username: string, input: UserEditInput): Promise<User | undefined> => {

  if (username === "super") {
    delete input.role
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        username: username
      },
      data: {
        ...input
      }
    })

    return updatedUser
  }
  catch (e: any) {
    errorHandler(e)
  }
}



export default { createUser, findAllUser, findUserByUsername, deleteUser, editUser }
