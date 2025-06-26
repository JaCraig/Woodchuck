import { ConsoleSink } from "./ConsoleSink";
import { DefaultFormatter } from "./DefaultFormatter";
import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";
import { LogFilter } from "./LogFilter";
import { LogLevel } from "./LogLevel";
import { LogSink } from "./LogSink";
import { LoggerConfiguration } from "./LoggerConfiguration";
import { MinimumLevelLogFilter } from "./MinimumLevelLogFilter";
import { OutputFormatter } from "./OutputFormatter";

// The pipline for a log sink that can be used to add filters, formatters and enrichers
// The pipeline is used to process log events before they are written to the sink
export class LogSinkPipeline {
  // Creates a new log sink pipeline
  // loggerConfiguration: The logger configuration that the pipeline belongs to
  constructor(loggerConfiguration: LoggerConfiguration) {
    this.loggerConfiguration = loggerConfiguration;
  }
  // The sink that the pipeline writes to
  private sink: LogSink = new ConsoleSink();
  // The filters that the pipeline uses to filter log events
  private filters: LogFilter[] = [];
  // The formatter that the pipeline uses to format log events
  private formatter: OutputFormatter = new DefaultFormatter();
  // The enrichers that the pipeline uses to enrich log events
  private enrichers: LogEventEnricher[] = [];
  // The logger configuration that the pipeline belongs to
  private loggerConfiguration: LoggerConfiguration;

  // Sets the sink that the pipeline writes to
  // sink: The sink to write to
  // Returns the logger configuration that the pipeline belongs to
  public writeTo(sink: LogSink): LoggerConfiguration {
    this.sink = sink;
    return this.loggerConfiguration;
  }

  // Adds a filter to the pipeline that filters log events by minimum level (lowest level to write)
  // level: The minimum level to write
  // Returns the pipeline
  public minimumLevel(level: LogLevel): LogSinkPipeline {
    this.filters.push(new MinimumLevelLogFilter(level));
    return this;
  }

  // Adds a filter to the pipeline that filters log events before they are written to the sink
  // filter: The filter to add
  // Returns the pipeline
  public filter(filter: LogFilter): LogSinkPipeline {
    this.filters.push(filter);
    return this;
  }

  // Sets the formatter that the pipeline uses to format log events before they are written to the sink
  // formatter: The formatter to use
  // Returns the pipeline
  public formatUsing(formatter: OutputFormatter): LogSinkPipeline {
    this.formatter = formatter;
    return this;
  }

  // Adds an enricher to the pipeline that enriches log events before they are written to the sink
  // enricher: The enricher to add
  // Returns the pipeline
  public enrichWith(enricher: LogEventEnricher): LogSinkPipeline {
    this.enrichers.push(enricher);
    return this;
  }

  // Processes a log event by filtering, enriching and formatting it before writing it to the sink
  // event: The log event to process
  public process(event: LogEvent): void {
    try {
      this.formatter ??= new DefaultFormatter();
      this.sink ??= new ConsoleSink();
      let eventCopy: LogEvent = Object.assign({}, event) as LogEvent;
      if (!this.filters.every((filter) => filter.filter(eventCopy))) {
        return;
      }
      this.enrichers.forEach((enricher) => enricher.enrich(eventCopy));
      eventCopy.message = this.formatter.format(eventCopy) || eventCopy.message;
      this.sink.write(eventCopy);
    } catch (err) {
      // Prevent a single pipeline failure from breaking the logger
      console.error("LogSinkPipeline: Failed to process log event", err, event);
    }
  }
}
