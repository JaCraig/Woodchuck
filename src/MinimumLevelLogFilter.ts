import { LogEvent } from "./LogEvent";
import { LogFilter } from "./LogFilter";
import { LogLevel } from "./LogLevel";

// Log filter implementation that filters log events by minimum level (lowest level to write)
export class MinimumLevelLogFilter implements LogFilter {
    // Creates a new minimum level log filter
    // minimumLevel: The minimum level to write (defaults to "Debug")
    constructor(minimumLevel: LogLevel = "Debug") {
        this.minimumLevel = minimumLevel;
        this.allowedLevels = this.allowedLevels.slice(this.allowedLevels.indexOf(minimumLevel));
    }

    // The allowed levels
    private allowedLevels: LogLevel[] = ["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"];

    // Filters a log event and returns true if the event should be written to a sink or false if it should be discarded
    // event: The log event to filter
    // Returns true if the event should be written to a sink or false if it should be discarded
    public filter(event: LogEvent): boolean {
        return this.allowedLevels.indexOf(event.level) >= 0;
    }

    // The minimum level to write
    private minimumLevel: LogLevel;
}
