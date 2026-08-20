// netlify/functions/count.js
// Returns the current global waitlist count
// Uses Netlify Blobs (free, built-in key-value store)

import { getStore } from '@netlify/blobs';

export default async function handler(req, context) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    const store = getStore('waitlist');
    const raw   = await store.get('count');
    const count = raw ? parseInt(raw, 10) : 0;

    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    // If blobs aren't set up yet return 0 gracefully
    return new Response(JSON.stringify({ count: 0 }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  }
}

export const config = { path: '/api/count' };
