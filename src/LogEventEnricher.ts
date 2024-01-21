import { LogEvent } from "./LogEvent";

// Log event enricher interface
// An enricher can add additional properties to a log event before it is written to a sink
export interface LogEventEnricher {
    // Enriches a log event
    // event: The log event to enrich
    enrich(event: LogEvent): void;
}
