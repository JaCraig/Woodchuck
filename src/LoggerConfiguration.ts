import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";
import { LogFilter } from "./LogFilter";
import { LogLevel } from "./LogLevel";
import { LogSinkPipeline } from "./LogSinkPipeline";
import { OutputFormatter } from "./OutputFormatter";
import { LogSink } from "./LogSink";

// Logger configuration that can be used to configure loggers
// The configuration is used to configure the sinks, filters, formatters and enrichers that are used by the logger
export class LoggerConfiguration {
    constructor() { }
    // The pipelines that the configuration uses to process log events
    private pipelines: LogSinkPipeline[] = [];

    // Sets the sink that the pipeline writes to
    // sink: The sink to write to
    // Returns the logger configuration that the pipeline belongs to
    public writeTo(sink: LogSink): LoggerConfiguration {
        let pipeline = new LogSinkPipeline(this);
        this.pipelines.push(pipeline);
        return pipeline.writeTo(sink);
    }

    // Adds a filter to the pipeline that filters log events by minimum level (lowest level to write)
    // level: The minimum level to write
    // Returns the pipeline
    public minimumLevel(level: LogLevel): LogSinkPipeline {
        let pipeline = new LogSinkPipeline(this);
        this.pipelines.push(pipeline);
        return pipeline.minimumLevel(level);
    }

    // Adds a filter to the pipeline that filters log events before they are written to the sink
    // filter: The filter to add
    // Returns the pipeline
    public filter(filter: LogFilter): LogSinkPipeline {
        let pipeline = new LogSinkPipeline(this);
        this.pipelines.push(pipeline);
        return pipeline.filter(filter);
    }

    // Sets the formatter that the pipeline uses to format log events before they are written to the sink
    // formatter: The formatter to use
    // Returns the pipeline
    public formatUsing(formatter: OutputFormatter): LogSinkPipeline {
        let pipeline = new LogSinkPipeline(this);
        this.pipelines.push(pipeline);
        return pipeline.formatUsing(formatter);
    }

    // Adds an enricher to the pipeline that enriches log events before they are written to the sink
    // enricher: The enricher to add
    // Returns the pipeline
    public enrichWith(enricher: LogEventEnricher): LogSinkPipeline {
        let pipeline = new LogSinkPipeline(this);
        this.pipelines.push(pipeline);
        return pipeline.enrichWith(enricher);
    }

    // Writes a log event to the configured sinks after processing it with the configured pipelines
    // level: The level of the log event
    // message: The message of the log event
    // properties: The properties of the log event
    // exception: The exception of the log event
    public write(level: LogLevel, message: string, properties?: { [key: string]: any; }, exception?: Error): void {
        let currentEvent: LogEvent = {
            level: level,
            message: message,
            properties: {},
            exception: exception,
            timestamp: new Date(),
            id: this.generateId(),
            args: properties
        };
        this.pipelines.forEach(pipeline => pipeline.process(currentEvent));
    }

    // Generates a guid in crypto.randomUUID format. If crypto not available fall back to Math.Random.
    private generateId(): string {
        if(typeof crypto !== "undefined") {
            return crypto.randomUUID();
        }
        // Go to fall back
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0;
            let v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
