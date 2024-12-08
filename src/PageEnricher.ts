import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// Page enricher that enriches log events with information about the page (url, title, etc)
export class PageEnricher implements LogEventEnricher {
    // Enriches a log event with the page information.
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        event.properties.url = location.href;
        event.properties.referrer = document.referrer;
        event.properties.title = document.title;
    }
}
