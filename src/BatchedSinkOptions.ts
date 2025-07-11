import { InMemoryStorage } from "./InMemoryStorage";

/**
 * BatchedSinkOptions configures the behavior of BatchedSink.
 *
 * Allows setting the maximum batch size, flush interval, and storage backend (localStorage or in-memory).
 *
 * Example usage:
 *   const options = new BatchedSinkOptions();
 *   options.maxBatchSize = 20;
 *   options.maxWaitTime = 1000;
 */
export class BatchedSinkOptions {
  // The maximum number of log events to buffer before writing them to the sink (default is 10)
  public maxBatchSize: number = 10;

  // The maximum time to wait before writing the buffered log events to the sink (default is 500ms)
  public maxWaitTime: number = 500;

  // The storage to use for the batched sink (default is localStorage in browser, in-memory in Node)
  public storage: Storage =
    typeof window !== "undefined" && window.localStorage
      ? window.localStorage
      : new InMemoryStorage();
}
