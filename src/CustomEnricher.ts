import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// Custom enricher that enriches log events with custom information supplied at initialization
export class CustomEnricher implements LogEventEnricher {
    constructor(propertyName: string, methodCall: (event: LogEvent) => any) {
        this.propertyName = propertyName;
        this.methodCall = methodCall;
    }

    // The name of the property to set on the log event
    private propertyName: string;

    // The method to call to get the value to set on the log event
    private methodCall: (event: LogEvent) => any;

    // Enriches a log event with the Custom the user has set.
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        event.properties[this.propertyName] = this.methodCall(event);
    }
}
