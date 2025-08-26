import type { Request, Response } from "express";
import type authRequest from "../interfaces/authRequest.ts";
export declare function register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function logout(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function profile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function updateProfile(req: authRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
