import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'MKOnlinePlayer API Test',
    status: 'success',
    timestamp: new Date().toISOString()
  });
}