// types.d.ts
import { JwtPayload } from 'jsonwebtoken';

interface UserPayload extends JwtPayload {
  id: string; // o el tipo correspondiente a tu _id de MongoDB
}

declare module 'express' {
  export interface Request {
    user?: UserPayload;  // Cambiado a UserPayload
  }
}
