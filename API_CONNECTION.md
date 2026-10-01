# API Proxy 代理连接文档

> 本代理用于将海外 AI API 代理到受限网络环境,支持 OpenAI、Anthropic、Groq 等服务的访问与流式响应。
> 当前版本部署于 **Netlify Edge Functions**(2026-10-01 部署并完成全链路验证)。

---

## 一、部署信息

### 生产地址

```
https://deno-api-proxy-q630.netlify.app
```

### 基础用法

```
https://PROXY_DOMAIN/proxy/API_HOST/path/params
```

即在原 API 地址的 `https://` 后插入 `PROXY_DOMAIN/proxy/`。

**示例:**
- `https://deno-api-proxy-q630.netlify.app/proxy/api.openai.com/v1/chat/completions`
- `https://deno-api-proxy-q630.netlify.app/proxy/api.anthropic.com/v1/messages`

**验证是否在线:** 浏览器打开 `https://deno-api-proxy-q630.netlify.app/proxy/`,应显示 `Proxy is Running!`。

---

## 二、支持的 API 服务

| 服务商 | 目标地址 | 文档链接 |
|--------|---------|---------|
| OpenAI | `api.openai.com` | https://platform.openai.com/docs |
| Anthropic | `api.anthropic.com` | https://docs.anthropic.com/en/api |
| Groq | `api.groq.com` | https://console.groq.com/docs |
| 智谱 GLM | `open.bigmodel.cn` | https://open.bigmodel.cn/dev/api |
| 硅基流动 | `api.siliconflow.cn` | https://docs.siliconflow.cn/api-reference/ |
| 月之暗面 | `api.moonshot.cn` | https://platform.moonshot.cn/docs |
| 零一万物 | `api.lingyiwanwu.com` | https://platform.lingyiwanwu.com/docs |

任何 HTTPS API 均可代理,不限于上表。

---

## 三、各 API 连接示例

### 3.1 OpenAI (GPT-4/GPT-3.5)

**curl:**
```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 1024
  }'
```

**Python:**
```python
import requests

response = requests.post(
    "https://deno-api-proxy-q630.netlify.app/proxy/api.openai.com/v1/chat/completions",
    headers={
        "Authorization": "Bearer YOUR_OPENAI_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "Hello!"}],
        "max_tokens": 1024
    }
)
print(response.json())
```

---

### 3.2 Anthropic (Claude)

**curl:**
```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_ANTHROPIC_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

> 注意:Anthropic 使用 `x-api-key` 头而非 `Authorization`,代理已支持这两个头的透传。

**Python:**
```python
import requests

response = requests.post(
    "https://deno-api-proxy-q630.netlify.app/proxy/api.anthropic.com/v1/messages",
    headers={
        "x-api-key": "YOUR_ANTHROPIC_KEY",
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
    },
    json={
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
print(response.json())
```

---

### 3.3 智谱 GLM

**curl:**
```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_BIGMODEL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4",
    "messages": [{"role": "user", "content": "你好"}],
    "temperature": 0.7
  }'
```

**常见错误排查:**

| 错误码 | 原因 | 解决 |
|--------|------|------|
| 400 | 模型名错误 | 确认使用 `glm-4`、`glm-4-plus` 等 |
| 401 | API Key 无效 | 检查 Key 是否正确复制 |
| 429 | 频率限制 | 减少请求频率,等待后重试 |

---

### 3.4 Groq

```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.groq.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.1-8b-instant",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

### 3.5 硅基流动 (SiliconFlow)

```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.siliconflow.cn/v1/chat/completions \
  -H "Authorization: Bearer YOUR_SF_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

### 3.6 月之暗面 (Moonshot)

```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.moonshot.cn/v1/chat/completions \
  -H "Authorization: Bearer YOUR_MOONSHOT_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonshot-v1-8k",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

### 3.7 零一万物 (LingYiWanWu)

```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.lingyiwanwu.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_LYW_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "yi-34b-chat-0205",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 四、流式响应 (SSE)

代理支持流式响应(Edge Function 逐块透传,无 10 秒时长限制),适合大模型对话场景。

### OpenAI 流式示例
```bash
curl https://deno-api-proxy-q630.netlify.app/proxy/api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "说一句话"}],
    "stream": true
  }'
```

### Python 流式处理
```python
import requests

response = requests.post(
    "https://deno-api-proxy-q630.netlify.app/proxy/api.openai.com/v1/chat/completions",
    headers={
        "Authorization": "Bearer YOUR_OPENAI_KEY",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "说一句话"}],
        "stream": True
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        print(line.decode('utf-8'))
```

---

## 五、支持的 HTTP 方法

| 方法 | 说明 |
|------|------|
| GET | 查询类请求 |
| POST | 创建/发送请求(最常用) |
| PUT | 更新资源 |
| PATCH | 部分更新 |
| DELETE | 删除资源 |
| OPTIONS | CORS 预检请求(代理直接返回 204 + CORS 头) |

---

## 六、请求头与响应头处理

### 代理透传的请求头(转发给目标服务)

- `Accept`
- `Content-Type`
- `Authorization`
- `x-api-key`(Anthropic)
- `anthropic-version`(Anthropic)
- `x-request-id`
- `x-stainless-406`

其余请求头(如 `User-Agent`、Cookie)**不会**转发。

### 代理响应头处理

- 剥除逐跳头:`Transfer-Encoding`、`Connection`、`Keep-Alive`、`Upgrade`、`Content-Length`
- 添加 CORS 头:允许任意来源跨域调用
- 添加 `Referrer-Policy: no-referrer`、`Cache-Control: no-store`
- 上游其余业务响应头(如 `x-ratelimit-*`)原样保留

---

## 七、可选鉴权(建议开启)

代理默认完全开放。为防止被陌生人滥用,建议设置访问口令:

**开启方法:** Netlify 后台 → `deno-api-proxy-q630` 站点 → **Site configuration → Environment variables** → 添加环境变量:

```
Key:   PROXY_TOKEN
Value: 自定义一个随机长字符串
```

保存后**重新部署一次**(Deploys → Trigger deploy)生效。

**开启后的调用方式:** 每个请求额外携带一个头:

```
X-Proxy-Token: 你设置的值
```

未携带或携带错误的请求会得到 `401 {"error":"Missing or invalid X-Proxy-Token"}`。

> 注意:鉴权使用 `X-Proxy-Token` 头而不是 `Authorization`,因为 `Authorization` 需要原样转发给目标 API,两者不冲突。

---

## 八、常见错误排查

### 8.1 404 "File Not Found"
**原因**:路径错误(目标域名前少了 `/proxy/`,或 `https://` 协议头被带进了路径)。
```
❌ https://PROXY_DOMAIN/api.openai.com/v1/chat/completions   (缺 /proxy/)
❌ https://PROXY_DOMAIN/proxy/https://api.openai.com/...      (协议头不能带)
✅ https://PROXY_DOMAIN/proxy/api.openai.com/v1/chat/completions
```

### 8.2 400 {"error":"Invalid target host"}
**原因**:`/proxy/` 后带了协议头(`https://`)或目标格式不合法。`/proxy/` 后直接写裸域名。

### 8.3 401
**原因**:目标 API 返回的认证错误。检查 API Key 是否正确、是否用了正确的头(`Authorization` vs `x-api-key`)。
若设置了 `PROXY_TOKEN` 而请求未带 `X-Proxy-Token`,也会返回 401(响应体是 `{"error":"Missing or invalid X-Proxy-Token"}`,可据此区分)。

### 8.4 429
**原因**:目标服务限流。降低请求频率或稍后重试。

### 8.5 502 {"error":"Proxy Error: ..."}
**原因**:目标服务不可达,或目标域名解析失败。检查目标域名拼写。

---

## 九、部署与运维信息

| 项 | 值 |
|---|---|
| 平台 | Netlify Edge Functions(Deno 运行时) |
| 站点名 | `deno-api-proxy-q630` |
| 站点 ID | `982ab5ef-27b3-404c-8190-d0aa31311f6b` |
| 代理代码 | `netlify/edge-functions/proxy.mjs`(GitHub 仓库同路径) |
| 路由 | `/proxy/*`(在 proxy.mjs 内以 `export const config` 声明) |
| 代码仓库 | https://github.com/q630778754/deno-api-proxy |
| 落地页 | 仓库根目录 `index.html` |

**改代码后重新部署的两种方式:**

1. **Git 自动部署(推荐):** Netlify 后台 → Site configuration → Build & deploy → Link repository 关联 `q630778754/deno-api-proxy`,之后 `git push` 自动部署。
2. **CLI 手动部署:** 将 `netlify.toml`、`index.html`、`netlify/edge-functions/proxy.mjs` 复制到一个纯英文路径的目录(如 `C:\nfdeploy`,注意部署目录内不要放会变动内容的文件),然后执行:

```bash
npx netlify-cli deploy --auth YOUR_NETLIFY_TOKEN --site 982ab5ef-27b3-404c-8190-d0aa31311f6b --prod
```

**2026-10-01 验证记录:**

| 测试 | 结果 |
|---|---|
| 落地页 `/` | HTTP 200 |
| `/proxy/` | HTTP 200 "Proxy is Running!" |
| `/proxy/example.com/` | HTTP 200,原样返回 |
| `/proxy/api.openai.com/v1/models`(无效 key) | HTTP 401,OpenAI 官方错误体(证明链路通) |
| `/proxy/api.anthropic.com/v1/models`(无效 key) | HTTP 401,Anthropic 官方错误体(证明头转发正常) |
| 恶意目标 | HTTP 400 |

---

## 十、安全注意

1. **不要在公共场合分享你的 API Key** 和代理地址
2. **开启第七节的 PROXY_TOKEN 鉴权**——代理无鉴权时,任何拿到地址的人都可将其作为通用出口代理
3. **定期轮换 API Key**;密钥建议用密钥管理工具(如 Doppler)集中管理,不要写进代码或文档
4. **监控用量**:Netlify 后台可查看边缘函数调用次数;免费档额度见 https://docs.netlify.com/platform/pricing/

---

## 十一、源代码与致谢

- 原项目: https://github.com/tech-shrimp/deno-api-proxy(作者:技术爬爬虾)
- 当前部署版本在原项目基础上做了以下修改:
  - 修复流式响应失效问题(原 Node 版把 Web Stream 传给了 Express `res.send()`,导致响应体恒为 `{}`)
  - 补充 Anthropic 必需头(`x-api-key`、`anthropic-version`)转发
  - 增加可选 `PROXY_TOKEN` 鉴权门
  - 增加目标格式校验(拒绝带协议头的目标)
  - 迁移至 Netlify Edge Functions(原因:Vercel `*.vercel.app` 与 Cloudflare `*.workers.dev` 在受限网络中 DNS 污染不可达;Netlify Edge 支持流式且无 10 秒限制)

---

## 十二、更新日志

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2026-01-29 | v1.0 | 初始版本(原项目) |
| 2026-09-29 | v1.1 | 尝试部署至 Vercel(后因域名污染不可用,已废弃) |
| 2026-10-01 | v2.0 | 迁移至 Netlify Edge Functions,修复流式响应,补充 Anthropic 头转发,增加可选鉴权;完成全链路验证 |
