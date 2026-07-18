import { JwtPayload } from '@/types/auth';
import { RequestContext } from '@/types/audit';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      context?: RequestContext;
    }
  }
}
