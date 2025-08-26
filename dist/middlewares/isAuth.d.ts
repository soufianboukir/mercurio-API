import type { NextFunction, Response } from "express";
import type authRequest from "../interfaces/authRequest.ts";
export declare function isAuth(
  req: authRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<any, Record<string, any>> | undefined>;
