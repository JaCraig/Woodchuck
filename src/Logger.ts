/**
 * Logger is the main entry point for writing log events.
 *
 * This static class provides configuration and logging methods for the application.
 * It manages the logger configuration, which controls sinks, filters, formatters, and enrichers.
 *
 * Usage:
 *   Logger.configure().writeTo(new ConsoleSink());
 *   Logger.information('message');
 */

import { BatchedSink } from "./BatchedSink";
import { BatchedSinkOptions } from "./BatchedSinkOptions";
import { CallerEnricher } from "./CallerEnricher";
import { ConsoleSink } from "./ConsoleSink";
import { CustomEnricher } from "./CustomEnricher";
import { DefaultFormatter } from "./DefaultFormatter";
import { LanguageEnricher } from "./LanguageEnricher";
import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";
import { LogFilter } from "./LogFilter";
import { LogLevel } from "./LogLevel";
import { LogSink } from "./LogSink";
import { LogSinkPipeline } from "./LogSinkPipeline";
import { LoggerConfiguration } from "./LoggerConfiguration";
import { MinimumLevelLogFilter } from "./MinimumLevelLogFilter";
import { OutputFormatter } from "./OutputFormatter";
import { PageEnricher } from "./PageEnricher";
import { UrlEnricher } from "./UrlEnricher";
import { UserAgentEnricher } from "./UserAgentEnricher";

declare namespace globalThis {
  // The global LoggerConfiguration
  var LoggerConfiguration: LoggerConfiguration;
}

// Logger class that is used to write log events
class Logger {
  // Hides the constructor
  private constructor() {}

  // The logger configuration
  private static loggerConfiguration: LoggerConfiguration;

  // Gets the logger configuration that the logger uses to configure its sinks, filters, formatters and enrichers
  public static configure(): LoggerConfiguration {
    this.loggerConfiguration ??=
      globalThis.LoggerConfiguration || new LoggerConfiguration();
    globalThis.LoggerConfiguration = this.loggerConfiguration;
    return this.loggerConfiguration;
  }

  // Writes a log event to the logger
  // level: The level of the log event
  // message: The message of the log event
  // properties: The properties of the log event
  // exception: The exception of the log event
  public static write(
    level: LogLevel,
    message: string,
    properties?: { [key: string]: any },
    exception?: Error
  ): void {
    Logger.configure().write(level, message, properties, exception);
  }

  // Writes a log event to the logger with the Verbose level
  // message: The message of the log event
  // properties: The properties of the log event
  public static verbose(
    message: string,
    properties?: { [key: string]: any }
  ): void {
    this.write("Verbose", message, properties);
  }

  // Writes a log event to the logger with the Debug level
  // message: The message of the log event
  // properties: The properties of the log event
  public static debug(
    message: string,
    properties?: { [key: string]: any }
  ): void {
    this.write("Debug", message, properties);
  }

  // Writes a log event to the logger with the Information level
  // message: The message of the log event
  // properties: The properties of the log event
  public static information(
    message: string,
    properties?: { [key: string]: any }
  ): void {
    this.write("Information", message, properties);
  }

  // Writes a log event to the logger with the Warning level
  // message: The message of the log event
  // properties: The properties of the log event
  public static warning(
    message: string,
    properties?: { [key: string]: any }
  ): void {
    this.write("Warning", message, properties);
  }

  // Writes a log event to the logger with the Error level
  // message: The message of the log event
  // properties: The properties of the log event
  // exception: The exception of the log event
  public static error(
    message: string,
    properties?: { [key: string]: any },
    exception?: Error
  ): void {
    this.write("Error", message, properties, exception);
  }

  // Writes a log event to the logger with the Fatal level
  // message: The message of the log event
  // properties: The properties of the log event
  // exception: The exception of the log event
  public static fatal(
    message: string,
    properties?: { [key: string]: any },
    exception?: Error
  ): void {
    this.write("Fatal", message, properties, exception);
  }
}

export {
  BatchedSink,
  BatchedSinkOptions,
  CallerEnricher,
  ConsoleSink,
  CustomEnricher,
  DefaultFormatter,
  LanguageEnricher,
  LogEvent,
  LogEventEnricher,
  LogFilter,
  Logger,
  LoggerConfiguration,
  LogLevel,
  LogSink,
  LogSinkPipeline,
  MinimumLevelLogFilter,
  OutputFormatter,
  PageEnricher,
  UrlEnricher,
  UserAgentEnricher,
};
