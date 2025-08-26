import type { Request, Response } from "express";
export declare function listUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function getUserById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
