import { VercelRequest, VercelResponse } from '@vercel/node';
import { createRouteHandler } from '../src/utils/vercelAdapter';
import aiRoutes from '../src/routes/ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return createRouteHandler(aiRoutes, '/api/ai')(req, res);
}
