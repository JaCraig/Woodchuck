import { LogLevel } from "./LogLevel";

// Log event interface
export interface LogEvent {
    // The timestamp of the log event
    timestamp: Date;
    // The log level
    level: LogLevel;
    // The message
    message: string;
    // The exception
    exception?: Error;
    // The properties of the log event
    properties: { [key: string]: any; };
    // The data of the log event
    args: any;
}
