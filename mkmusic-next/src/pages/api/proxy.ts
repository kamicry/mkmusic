import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // In a real implementation, this would proxy requests to the actual music API
    // For now, we'll return mock data based on the request type
    
    const { types } = req.query;
    
    switch (types) {
      case 'search':
        // Mock search results
        const mockSearchResults = [
          {
            id: '123456',
            name: 'Test Song',
            artist: ['Test Artist'],
            album: 'Test Album',
            source: 'netease',
            url_id: '123456',
            pic_id: 'test_pic',
            lyric_id: '123456'
          }
        ];
        res.status(200).json(mockSearchResults);
        break;

      case 'url':
        // Mock URL response
        res.status(200).json({
          url: 'https://example.com/test.mp3'
        });
        break;

      case 'pic':
        // Mock picture response
        res.status(200).json({
          url: 'https://example.com/test.jpg'
        });
        break;

      case 'lyric':
        // Mock lyric response
        res.status(200).json({
          lyric: '[00:00.00] Test lyric line 1\n[00:10.00] Test lyric line 2'
        });
        break;

      default:
        res.status(400).json({ error: 'Unknown request type' });
    }
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}