// =============================================================================
// BioR Platform v8.8 — SSE Event Bus (Issue #1)
// =============================================================================
// In-memory pub/sub for Server-Sent Events. Each connected client gets a
// ReadableStreamController. broadcast() pushes typed events to all subscribers.
// Cloudflare Workers isolate note: subscribers are per-isolate (no cross-worker
// state), which is fine for single-instance Pages dev and typical Pages traffic.
// =============================================================================

export interface SSEEvent {
  event: 'alert' | 'ews_update' | 'surveillance' | 'system' | 'notification';
  data: Record<string, unknown>;
  timestamp?: string;
}

// Active SSE subscribers (controller → userId)
const subscribers = new Map<ReadableStreamDefaultController, string>();

/**
 * Broadcast an event to all connected SSE clients.
 */
export function broadcast(evt: SSEEvent): void {
  const ts = evt.timestamp || new Date().toISOString();
  const payload = JSON.stringify({ ...evt.data, _ts: ts });
  const message = `event: ${evt.event}\ndata: ${payload}\n\n`;
  const encoder = new TextEncoder();
  const chunk = encoder.encode(message);

  for (const [controller] of subscribers) {
    try {
      controller.enqueue(chunk);
    } catch {
      // Client disconnected — remove on next heartbeat
      subscribers.delete(controller);
    }
  }
}

/**
 * Register a new SSE client.
 */
export function subscribe(controller: ReadableStreamDefaultController, userId: string): void {
  subscribers.set(controller, userId);
}

/**
 * Unregister a disconnected SSE client.
 */
export function unsubscribe(controller: ReadableStreamDefaultController): void {
  subscribers.delete(controller);
}

/**
 * Get count of active subscribers (for admin health).
 */
export function subscriberCount(): number {
  return subscribers.size;
}

/**
 * Send a keepalive comment to all subscribers (prevents idle timeout).
 * Cloudflare Workers free plan has ~30s idle timeout on streaming responses.
 */
export function heartbeat(): void {
  const encoder = new TextEncoder();
  const beat = encoder.encode(`:keepalive ${Date.now()}\n\n`);
  for (const [controller] of subscribers) {
    try {
      controller.enqueue(beat);
    } catch {
      subscribers.delete(controller);
    }
  }
}
