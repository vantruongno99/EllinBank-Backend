import { Prisma } from '@prisma/client'
const errorHandler = (e: any) => {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
            case 'P2002': {
                throw ({ name: 'DuplicationError', message: `${e.meta?.target} already exist` });
            }
            case 'P2025': {
                throw ({ name: 'NotFoundError', message: `Not Found` });
            }
            default: throw ({ name: 'ValidationError', message: JSON.stringify(e) })
        }
    }
    throw ({ name: 'ValidationError', message: JSON.stringify(e) });
}

export default errorHandler