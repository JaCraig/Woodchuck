import { LogEvent } from "./LogEvent";

// Log sink interface
export interface LogSink {
  // Writes a log event to the sink
  // event: The log event to write
  // The implementation may return a Promise for async sinks. Consumers should handle Promise rejections.
  write(event: LogEvent): void | Promise<void>;
}
