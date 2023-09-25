import { LoginInput, PasswordChangeInput, AdminPasswordChangeInput, LoginResponse } from "../models/auth.modal"
import bcrypt from 'bcrypt'
import { prisma } from "../../prisma/prismaClient"
import tokenGenerator from "../utils/tokenGenerator"



const login = async (input: LoginInput): Promise<LoginResponse> => {
  const username = input.username?.trim();
  const password = input.password?.trim();

  if (!username) {
    throw ({ name: 'ValidationError', message: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw ({ name: 'ValidationError', message: { password: ["can't be blank"] } });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      email: true,
      username: true,
      hashedPassword: true,
      role: true
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.hashedPassword)

    if (match) {
      const res = (({ username, email, role }) => ({ username, email, role }))(user);
      return {
        ...res,
        token: tokenGenerator(user)
      }
    }
  }

  throw ({ name: 'ValidationError', message: "login credentials are incorrect" });
}


const resetPassword = async (input: PasswordChangeInput): Promise<void> => {
  const username = input.username?.trim();
  const password = input.password?.trim();
  const newPassword = input.newPassword?.trim()

  if (!username) {
    throw ({ name: 'ValidationError', message: " username is blank" });
  }

  if (!password) {
    throw ({ name: 'ValidationError', message: " password is blank" });
  }

  if (!newPassword) {
    throw ({ name: 'ValidationError', message: " newPassword is blank" });
  }


  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      email: true,
      username: true,
      hashedPassword: true
    },
  });

  if (!user) {
    throw ({ name: 'ValidationError', message: ` user: does not exist ` });

  }

  const match = await bcrypt.compare(password, user.hashedPassword)

  if (!match) {
    throw ({ name: 'ValidationError', message: ` password: incorrect ` });
  }

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  try {
    await prisma.user.update({
      where: {
        username
      },
      data: {
        hashedPassword
      }
    });
  }

  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }

  }
}

const adminResetPassword = async (input: AdminPasswordChangeInput): Promise<void> => {
  const username = input.username?.trim();
  const newPassword = input.newPassword?.trim()

  if (!username) {
    throw ({ name: 'ValidationError', message: " username is blank" });
  }


  if (!newPassword) {
    throw ({ name: 'ValidationError', message: " newPassword is blank" });
  }

  if (username === "super") {
    throw ({ name: 'ValidationError', message: "For super , please change username in Profile" });
  }



  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      email: true,
      username: true,
      hashedPassword: true
    },
  });

  if (!user) {
    throw ({ name: 'ValidationError', message: ` user: does not exist ` });

  }


  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  try {
    await prisma.user.update({
      where: {
        username
      },
      data: {
        hashedPassword
      }
    });
  }

  catch (e: any) {
    if (e.meta.target) {
      throw ({ name: 'ValidationError', message: `${e.meta.target} is not unique` });
    }

  }
}






export default { login, resetPassword, adminResetPassword }