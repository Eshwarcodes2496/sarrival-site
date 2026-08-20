import { getStore } from '@netlify/blobs';

function validEmail(e) {
  if (!e || e.length < 5 || e.length > 254) return false;
  const at = e.indexOf('@');
  if (at < 1 || at !== e.lastIndexOf('@')) return false;
  const domain = e.slice(at + 1);
  const dot = domain.lastIndexOf('.');
  return dot >= 1 && domain.slice(dot + 1).length >= 2;
}

export default async function(req) {
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'bad request' }, { status: 400 }); }

  const email = (body.email || '').trim().toLowerCase();
  if (!validEmail(email)) return Response.json({ error: 'invalid_email' }, { status: 422 });

  const store = getStore('wl');
  const key = 'e:' + Buffer.from(email).toString('base64');
  if (await store.get(key)) {
    const n = parseInt(await store.get('count') || '1');
    return Response.json({ ok: true, count: n, position: n });
  }

  let count = parseInt(await store.get('count') || '0') + 1;
  await store.set('count', String(count));
  await store.set(key, String(count));

  return Response.json({ ok: true, count, position: count });
}

export const config = { path: '/api/join' };
