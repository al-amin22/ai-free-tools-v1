# Security Documentation
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Security Architecture

### 1.1 Defense in Depth Layers
1. CDN/WAF layer (Cloudflare)
2. Nginx reverse proxy (rate limiting, security headers)
3. Next.js middleware (CSRF, auth checks)
4. NestJS guards (JWT, RBAC, rate limiting)
5. Input validation (Zod / class-validator)
6. Database (parameterized queries via Prisma)
7. AI output sanitization

---

## 2. Input Validation

All API inputs validated with class-validator + Zod:

```typescript
// Example: NDA generation input validation
class GenerateNDADto {
  @IsString()
  @Length(2, 200)
  @Matches(/^[a-zA-Z0-9\s\-.,&']+$/)  // alphanumeric + business chars only
  disclosingParty: string;

  @IsString()
  @Length(2, 200)
  receivingParty: string;

  @IsEnum(US_STATES)
  state: string;

  @IsInt()
  @Min(1)
  @Max(10)
  duration: number;
}
```

Rules:
- No HTML in text inputs (strip with DOMPurify server-side)
- No script injection (reject inputs with `<script`, `javascript:`)
- Length limits on all string fields
- Enum validation for select fields
- Number bounds on numeric fields

---

## 3. XSS Prevention

- AI-generated output rendered with React's JSX (auto-escaping)
- HTML output (if any) sanitized with `sanitize-html` (allowlist-based)
- `Content-Security-Policy` header configured
- No `dangerouslySetInnerHTML` without sanitization

---

## 4. SQL Injection Prevention

- All DB queries via Prisma ORM (parameterized queries)
- No raw SQL without `Prisma.$queryRaw` template literal (auto-escaped)
- DB user has minimal permissions (SELECT, INSERT, UPDATE — no DROP/ALTER)

---

## 5. Authentication Security

### 5.1 JWT Configuration
```typescript
const jwtConfig = {
  accessToken: { expiresIn: '15m', algorithm: 'RS256' },
  refreshToken: { expiresIn: '30d', algorithm: 'RS256' },
  // RS256 = asymmetric — private key signs, public key verifies
};
```

### 5.2 Password Policy
- Minimum 8 characters
- Hashed with bcrypt (salt rounds: 12)
- No password stored in plain text anywhere
- Rate limited login (5 attempts/15min per IP)

---

## 6. HTTP Security Headers

```nginx
# Nginx security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ..." always;
```

---

## 7. Rate Limiting

### 7.1 Nginx Level
```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;
limit_req_zone $binary_remote_addr zone=generate:10m rate=10r/m;
```

### 7.2 Application Level
```typescript
// NestJS rate limit guard
@UseGuards(ThrottlerGuard)
@Throttle({ default: { ttl: 3600, limit: 10 } }) // 10/hour anonymous
async generate() {}
```

---

## 8. AI Output Security

AI output is untrusted and MUST be sanitized:

```typescript
function sanitizeAIOutput(output: string): string {
  // Remove any HTML tags
  let clean = stripHtml(output).result;
  
  // Remove potentially injected prompts
  clean = clean.replace(/\[INST\]|\[\/INST\]|<\|im_start\|>/g, '');
  
  // Limit length
  clean = clean.substring(0, 50000);
  
  return clean;
}
```

---

## 9. GDPR/CCPA Compliance

- Cookie consent banner (before analytics load)
- Privacy policy linked in footer
- Data deletion endpoint: `DELETE /api/v1/users/me`
- No PII stored for anonymous users
- Logs automatically expire after 30 days
- Data processing agreement with AI providers

---

## 10. Secrets Management

- All secrets in environment variables (never in code)
- `.env` files never committed (`.gitignore`)
- Production secrets in Docker secrets or Vault
- API keys rotated every 90 days
- Separate keys per environment (dev/staging/prod)
