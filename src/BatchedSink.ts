/**
 * BatchedSink buffers log events and writes them to another sink in batches.
 *
 * This class is useful for reducing the number of writes to a sink, especially for remote or expensive sinks.
 * It supports configurable batch size, flush interval, and persistent storage (localStorage or in-memory).
 *
 * Example usage:
 *   const batchedSink = new BatchedSink(new ConsoleSink(), new BatchedSinkOptions());
 *   batchedSink.write(event);
 */

import { BatchedSinkOptions } from "./BatchedSinkOptions";
import { LogEvent } from "./LogEvent";
import { LogSink } from "./LogSink";

// Batched sink that stores log events in a buffer and writes them to another sink in batches
export class BatchedSink implements LogSink {
  // The options for the batched sink
  public constructor(sink: LogSink, options: BatchedSinkOptions) {
    this.sink = sink;
    this.options = options;
    this.timer = setInterval(() => this.flush(), this.options.maxWaitTime);
    this.buffer = <LogEvent[]>(
      JSON.parse(this.options.storage.getItem("logBuffer") || "[]")
    );

    if (this.isBrowser()) {
      window.addEventListener("beforeunload", () => this.flush());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "hidden") {
          return;
        }
        this.flush();
      });
    }
  }

  // Is this running in a browser?
  private isBrowser(): boolean {
    return typeof window !== "undefined";
  }

  // The buffer of log events
  private buffer: LogEvent[] = [];

  // The sink to write the log events to
  private sink: LogSink;

  // The options for the batched sink
  private options: BatchedSinkOptions;

  // The timer to flush the buffer
  private timer: ReturnType<typeof setTimeout>;

  // flushes the buffer to the underlying sink
  // Exposed as public to allow explicit flushing during shutdown
  public flush(): void {
    if (this.buffer.length == 0) {
      return;
    }
    for (let event of this.buffer) {
      try {
        const result = this.sink.write(event);
        // If the underlying sink is async, attach a rejection handler so it doesn't become an unhandled rejection
        if (result && typeof (result as any).then === "function") {
          (result as Promise<void>).catch((err) => {
            console.error(
              "BatchedSink: Async sink failed to write event",
              err,
              event
            );
          });
        }
      } catch (err) {
        // Optionally, you could push to a failed buffer or log to console
        console.error("BatchedSink: Failed to write event to sink", err, event);
      }
    }
    this.buffer = [];
    try {
      this.options.storage.setItem("logBuffer", JSON.stringify(this.buffer));
    } catch (err) {
      // Ignore storage set errors during flush
    }
  }

  // Closes the batched sink, flushing remaining events and clearing timers
  public close(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    try {
      this.flush();
    } catch (err) {
      console.error("BatchedSink: Failed to close properly", err);
    }
  }

  // Writes a log event to the buffer
  // event: The log event to write
  public write(event: LogEvent): void {
    try {
      this.buffer.push(event);
      try {
        this.options.storage.setItem("logBuffer", JSON.stringify(this.buffer));
      } catch (err) {
        // Ignore storage errors while buffering
      }
      if (this.buffer.length >= this.options.maxBatchSize) {
        this.flush();
      }
    } catch (err) {
      console.error(
        "BatchedSink: Failed to buffer or persist event",
        err,
        event
      );
    }
  }
}
