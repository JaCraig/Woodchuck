import { LogEvent } from "./LogEvent";

// Log sink interface
export interface LogSink {
    // Writes a log event to the sink
    // event: The log event to write
    write(event: LogEvent): void;
}
