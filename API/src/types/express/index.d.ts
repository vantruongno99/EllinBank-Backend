import { UserProfile } from "../../models/user.modal"
declare global{
    namespace Express {
        interface Request {
            user : UserProfile|null,
            token  : String
        }
    }
}