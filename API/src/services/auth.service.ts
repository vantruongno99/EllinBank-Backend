import { RegisterInput, LoginInput } from "../models/auth.modal"
import bcrypt from 'bcrypt'
import { prisma } from "../../prisma/prismaClient"
import tokenGenerator from "../utils/tokenGenerator"



const login = async (input: LoginInput) => {
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
      hashedPassword: true
    },
  });

  if (user) {
    const match = await bcrypt.compare(password, user.hashedPassword)

    if (match) {
      const res = (({ username, email }) => ({ username, email }))(user);
      return {
        ...res,
        token: tokenGenerator(user)
      }
    }
  }

  throw ({ name: 'ValidationError', message: "login credentials are incorrect" });
}


export default {login}