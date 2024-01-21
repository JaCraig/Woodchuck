import { LogEvent } from "./LogEvent";
import { OutputFormatter } from "./OutputFormatter";

// Default log output formatter implementation
export class DefaultFormatter implements OutputFormatter {
    // Creates a new default log output formatter
    // outputFormat: The output format to use when formatting log events (defaults to "{Timestamp}: [{Level}]: {Message}{Exception}")
    // The following placeholders can be used in the output format:
    // {Timestamp}: The timestamp of the log event
    // {Level}: The log level of the log event
    // {Message}: The message of the log event
    // {Exception}: The exception of the log event
    // {PropertyName}: The properties of the log event (where PropertyName is the name of the property)
    constructor(outputFormat?: string) {
        this.outputFormat = outputFormat ?? "[{Timestamp}]\t[{Level}]\t{Message}{Exception}";
    }

    // The output format to use when formatting log events (defaults to "{Timestamp}: [{Level}]: {Message}{Exception}")
    private outputFormat: string;

    // Formats a log event into a string using the output format
    // event: The log event to format into a string
    // Returns the formatted log event
    public format(event: LogEvent): string {
        return this.outputFormat.replace(/{(\w+)}/g, (match, propertyName) => {
            if (propertyName === "Timestamp") {
                return event.timestamp.toISOString();
            } else if (propertyName === "Level") {
                return event.level;
            } else if (propertyName === "Message") {
                return event.message;
            } else if (propertyName === "Exception") {
                return event.exception ? "\n" + event.exception.stack : "";
            } else {
                return event.properties[propertyName];
            }
        });
    }
}
