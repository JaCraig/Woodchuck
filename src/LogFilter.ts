import { LogEvent } from "./LogEvent";

// Log filter interface
// A filter can be used to filter log events before they are written to a sink
export interface LogFilter {
    // Filters a log event and returns true if the event should be written to a sink or false if it should be discarded
    // event: The log event to filter
    // Returns true if the event should be written to a sink or false if it should be discarded
    filter(event: LogEvent): boolean;
}
