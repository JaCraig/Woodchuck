import { LogEvent } from "./LogEvent";

// Log output formatter interface
export interface OutputFormatter {
    // Formats a log event into a string
    // event: The log event to format into a string
    // Returns the formatted log event
    format(event: LogEvent): string;
}
