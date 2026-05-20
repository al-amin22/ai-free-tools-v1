# Queue Architecture
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Queue Stack

- **Queue library**: BullMQ
- **Backend**: Redis 7 (Cluster mode for production)
- **Workers**: NestJS worker services (horizontally scalable)

---

## 2. Queue Definitions

```typescript
export const QUEUES = {
  AI_GENERATION: 'ai:generation',        // User-facing tool generation
  AI_EXPORT: 'ai:export',                // PDF/DOCX export
  AI_IMAGE: 'ai:image-generation',       // OG/featured images
  AI_SEO_CONTENT: 'ai:seo-content',      // AI Manager content jobs
  AI_SEO_AUDIT: 'ai:seo-audit',          // SEO audit jobs
  AI_INTERNAL_LINKS: 'ai:internal-links',// Link optimization
  AI_FAQ: 'ai:faq-generation',           // FAQ generation
  ANALYTICS: 'analytics:events',         // Event ingestion
  EMAIL: 'email:notifications',          // Email sending
} as const;
```

---

## 3. Priority Levels

| Queue | Priority | Reason |
|-------|----------|--------|
| ai:generation | 1 (highest) | User is waiting in real-time |
| ai:export | 2 | User requested file download |
| email:notifications | 3 | Time-sensitive |
| analytics:events | 5 | Non-blocking |
| ai:image-generation | 6 | Background |
| ai:faq-generation | 7 | Background |
| ai:seo-content | 8 | Background |
| ai:internal-links | 9 | Background |
| ai:seo-audit | 10 (lowest) | Scheduled background |

---

## 4. Job Definitions

### 4.1 AI Generation Job

```typescript
interface AIGenerationJob {
  generationId: string;
  toolSlug: string;
  inputs: Record<string, unknown>;
  promptVersion: string;
  userId?: string;
  sessionId: string;
  stream: boolean;
  streamChannel?: string; // Redis channel for SSE
}
```

### 4.2 Export Job

```typescript
interface ExportJob {
  exportId: string;
  generationId: string;
  format: 'pdf' | 'docx';
  toolSlug: string;
  content: string;
  options: ExportOptions;
  userId?: string;
}
```

### 4.3 SEO Content Job

```typescript
interface SEOContentJob {
  jobType: 'tool_page' | 'state_page' | 'article' | 'faq' | 'comparison';
  toolSlug?: string;
  stateCode?: string;
  topic?: string;
  priority: 'immediate' | 'normal' | 'low';
}
```

---

## 5. Retry Configuration

```typescript
const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,   // 2s, 4s, 8s
  },
  removeOnComplete: {
    count: 1000,   // Keep last 1000 completed
    age: 86400,    // 24 hours
  },
  removeOnFail: {
    count: 5000,   // Keep failed for debugging
    age: 604800,   // 7 days
  },
};

// AI generation: shorter timeout
const aiGenerationOptions: JobsOptions = {
  ...defaultJobOptions,
  timeout: 30000,  // 30s hard limit
};
```

---

## 6. Dead Letter Queue

Failed jobs after all retries → `dlq:{queueName}` queue.

```typescript
// DLQ processor — alert + manual retry capability
@Processor('dlq:ai:generation')
class DLQProcessor {
  async process(job: Job<AIGenerationJob>) {
    await this.alertService.sendCriticalAlert({
      message: `Generation job failed after all retries`,
      generationId: job.data.generationId,
      error: job.failedReason,
    });
    
    await this.generationService.markAsFailed(
      job.data.generationId,
      job.failedReason,
    );
  }
}
```

---

## 7. Worker Configuration

```typescript
// Concurrency per worker instance
const WORKER_CONCURRENCY = {
  'ai:generation': 5,    // 5 concurrent AI calls per worker
  'ai:export': 10,       // PDF/DOCX is fast
  'ai:seo-content': 2,   // Background, lower priority
  'analytics:events': 50, // Very fast, high volume
};

// Scale workers based on queue depth
// Kubernetes: HPA or Docker Swarm replicas
```

---

## 8. Monitoring

```typescript
// Expose queue metrics to Prometheus
const metrics = {
  'queue_jobs_completed_total': Counter,
  'queue_jobs_failed_total': Counter,
  'queue_jobs_active': Gauge,
  'queue_jobs_waiting': Gauge,
  'queue_job_duration_seconds': Histogram,
};
```

BullBoard UI available at `/admin/queues` (admin only).
