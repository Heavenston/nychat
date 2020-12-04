import type { NextApiRequest, NextApiResponse } from 'next'

type Route = (req: NextApiRequest, res: NextApiResponse) => Promise<void>
type Routes = {
  [methodName: string]: Route
}

export async function MethodRouter(routes: Routes): Promise<Route> {
  return async (req, res) => {
    const route = routes[req.method || ''] as Route | undefined
    if (route) {
      await route(req, res)
    } else {
      res.status(404).end()
    }
  }
}
