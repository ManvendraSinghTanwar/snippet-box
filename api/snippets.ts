import { VercelRequest, VercelResponse } from '@vercel/node';
import { createRouteHandler } from '../src/utils/vercelAdapter';
import snippetRoutes from '../src/routes/snippets';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return createRouteHandler(snippetRoutes, '/api/snippets')(req, res);
}
