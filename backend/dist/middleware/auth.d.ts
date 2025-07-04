import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    userId?: string;
    user?: any;
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export { AuthenticatedRequest };
//# sourceMappingURL=auth.d.ts.map