# Monitoring & Observability
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Stack

- **Metrics**: Prometheus + Grafana
- **Logs**: Loki + Grafana (via promtail)
- **Traces**: OpenTelemetry (future)
- **Alerting**: Grafana Alerts → Slack/PagerDuty
- **Uptime**: Better Uptime / UptimeRobot

---

## 2. Key Metrics

### Business Metrics
- `tool_generations_total{tool, status}` — counter
- `tool_exports_total{tool, format}` — counter
- `ai_cost_usd_total{provider, tool}` — counter
- `active_users_gauge` — gauge
- `premium_subscribers_gauge` — gauge

### Technical Metrics
- `http_request_duration_seconds{method, path, status}` — histogram
- `ai_generation_duration_seconds{tool, provider}` — histogram
- `queue_jobs_active{queue}` — gauge
- `queue_jobs_waiting{queue}` — gauge
- `cache_hit_rate{type}` — gauge
- `db_query_duration_seconds{query}` — histogram

---

## 3. Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| High error rate | error_rate > 1% for 5min | critical |
| AI provider down | all providers failing | critical |
| Queue backlog | waiting > 500 for 10min | warning |
| Slow AI generation | p95 > 10s for 5min | warning |
| DB connection pool exhausted | pool usage > 90% | critical |
| High memory | memory > 85% | warning |
| Disk full | disk > 90% | critical |

---

## 4. Grafana Dashboards

- **Platform Overview**: traffic, generations, exports, revenue
- **AI Performance**: latency, tokens, cost, provider health
- **SEO Metrics**: indexed pages, GSC data, Core Web Vitals
- **Queue Health**: job rates, processing times, failures
- **Infrastructure**: CPU, memory, disk, network

---

## 5. Log Structure

```json
{
  "timestamp": "2026-05-19T10:00:00Z",
  "level": "info",
  "service": "api",
  "traceId": "abc123",
  "userId": "uuid",
  "method": "POST",
  "path": "/api/v1/tools/nda-generator/generate",
  "statusCode": 200,
  "durationMs": 2340,
  "message": "Tool generation completed"
}
```

All logs to stdout → Loki via promtail → Grafana.
