// Netlify Edge Function: API 反向代理
// 路由: https://<站点名>.netlify.app/proxy/<目标域名>/<路径>
// 示例: https://<站点名>.netlify.app/proxy/api.openai.com/v1/chat/completions
//
// 可选鉴权: 在 Netlify 后台 Site configuration → Environment variables 里设
// PROXY_TOKEN 后，请求必须带 X-Proxy-Token: <token> 头。
// 未设置时保持完全开放（与原版行为一致）。
// 注意不能用 Authorization 做鉴权——那个头要原样转发给目标 API。

export const config = { path: "/proxy/*" };

const HOME =
  'Proxy is Running!\n' +
  'Example: https://<your-site>.netlify.app/proxy/api.openai.com/v1/chat/completions\n' +
  'Sources: https://github.com/tech-shrimp/deno-api-proxy';

// 必须原样转发给目标 API 的请求头。
// 原版只转发 accept/content-type/authorization，会丢掉 Anthropic 必需的
// x-api-key / anthropropic-version，导致 Claude 调不通，这里一并补上。
const FORWARD_HEADERS = [
  'accept',
  'content-type',
  'authorization',
  'x-api-key',
  'anthropic-version',
  'x-request-id',
  'x-stainless-406',
];

// 响应里不能原样回传的逐跳头。
// content-length 必须剥掉：流式回传时长度会变，留着客户端直接报错。
const STRIP_RESPONSE_HEADERS = [
  'transfer-encoding',
  'connection',
  'keep-alive',
  'upgrade',
  'content-length',
];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Accept, x-api-key, anthropic-version, X-Proxy-Token',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Expose-Headers': '*',
  };
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

export default async function handler(request, context) {
  const url = new URL(request.url);

  // /proxy/ 后面的部分 = 目标域名/路径
  const target = url.pathname.replace(/^\/proxy\//, '').replace(/^\/+/, '');
  const qs = url.search;

  if (!target || target === 'index.html') {
    return new Response(HOME, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders() },
    });
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // 可选鉴权门
  const env = context.env || {};
  if (env.PROXY_TOKEN) {
    const given = request.headers.get('x-proxy-token');
    if (given !== env.PROXY_TOKEN) {
      return json({ error: 'Missing or invalid X-Proxy-Token' }, 401);
    }
  }

  // 目标必须是"域名/路径"，不能带协议头，否则会被拼成 https://https://...
  let hostname;
  try {
    hostname = new URL(`https://${target}`).hostname;
  } catch {
    return json({ error: 'Invalid target' }, 400);
  }
  if (!hostname || /^[a-z][a-z0-9+.-]*:\/\//i.test(target)) {
    return json({ error: 'Invalid target host' }, 400);
  }

  const targetUrl = `https://${target}${qs}`;

  try {
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (FORWARD_HEADERS.includes(key.toLowerCase())) headers.set(key, value);
    }

    const options = { method: request.method, headers };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // 请求体是 Web ReadableStream，duplex 必须显式声明为 half
      options.body = request.body;
      options.duplex = 'half';
    }

    const upstream = await fetch(targetUrl, options);

    const responseHeaders = new Headers(upstream.headers);
    for (const h of STRIP_RESPONSE_HEADERS) responseHeaders.delete(h);
    responseHeaders.set('Referrer-Policy', 'no-referrer');
    responseHeaders.set('Cache-Control', 'no-store');
    for (const [key, value] of Object.entries(corsHeaders())) {
      responseHeaders.set(key, value);
    }

    // Edge runtime：直接把 Web ReadableStream 交给 Response 就能边收边推，
    // SSE / 流式对话都是这样透传的。
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy failed:', error);
    return json({ error: `Proxy Error: ${String((error && error.message) || error)}` }, 502);
  }
}
