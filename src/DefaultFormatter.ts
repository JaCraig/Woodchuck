/**
 * DefaultFormatter formats log events into strings using a customizable template.
 *
 * Supports placeholders for event properties, such as {Timestamp}, {Level}, {Message}, {Exception}, and custom properties.
 *
 * Example usage:
 *   const formatter = new DefaultFormatter();
 *   const output = formatter.format(event);
 */

import { LogEvent } from "./LogEvent";
import { OutputFormatter } from "./OutputFormatter";

// Default log output formatter implementation
export class DefaultFormatter implements OutputFormatter {
  // Creates a new default log output formatter
  // outputFormat: The output format to use when formatting log events (defaults to "{Timestamp}: [{Level}]: {Message}{Exception}")
  // The following placeholders can be used in the output format:
  // {Id}: The ID of the log event
  // {Timestamp}: The timestamp of the log event
  // {Level}: The log level of the log event
  // {Message}: The message of the log event
  // {Exception}: The exception of the log event
  // {PropertyName}: The properties of the log event (where PropertyName is the name of the property)
  constructor(outputFormat?: string) {
    this.outputFormat =
      outputFormat ?? "[{Timestamp}]\t[{Level}]\t{Message}{Exception}";
  }

  // The output format to use when formatting log events (defaults to "{Timestamp}: [{Level}]: {Message}{Exception}")
  private outputFormat: string;

  // Formats a log event into a string using the output format
  // event: The log event to format into a string
  // Returns the formatted log event
  public format(event: LogEvent): string {
    // Cache the regex for performance
    const formatRegex = DefaultFormatter.formatRegex;
    return this.outputFormat.replace(formatRegex, (match, propertyName) => {
      switch (propertyName) {
        case "Id":
          return event.id;
        case "Timestamp":
          return event.timestamp.toISOString();
        case "Level":
          return event.level;
        case "Message":
          return event.message;
        case "Exception":
          return event.exception ? "\n" + event.exception.stack : "";
        default:
          return event.properties &&
            event.properties[propertyName] !== undefined
            ? String(event.properties[propertyName])
            : "";
      }
    });
  }

  // Cache the regex as a static property
  private static formatRegex = /{(\w+)}/g;
}
