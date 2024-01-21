import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// User agent enricher that enriches log events with the user agent
export class UserAgentEnricher implements LogEventEnricher {
    // Enriches a log event with the user agent
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        event.properties.userAgent = navigator.userAgent;
    }
}
