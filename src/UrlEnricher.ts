import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// Enriches a log event with the current URL
export class UrlEnricher implements LogEventEnricher {
    // Enriches a log event with the current URL
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        event.properties.url = window.location.href;
    }
}
