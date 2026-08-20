import { getStore } from '@netlify/blobs';

export default async function(req) {
  try {
    const store = getStore('wl');
    const n = await store.get('count');
    return Response.json({ count: n ? parseInt(n) : 0 });
  } catch {
    return Response.json({ count: 0 });
  }
}

export const config = { path: '/api/count' };
