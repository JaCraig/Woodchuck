import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// Language enricher that enriches log events with the language
export class LanguageEnricher implements LogEventEnricher {
    // Enriches a log event with the language the user has set.
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        event.properties.language = navigator.language;
    }
}
