import User from "../../models/UserModel";

declare global {
    namespace Express {
        interface Request {
            user?: User | null;
        }
    }
}

export {};