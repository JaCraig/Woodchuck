/**
 * ConsoleSink writes log events to the browser or Node.js console.
 *
 * Supports colorized output and grouping for structured or object arguments.
 * Handles all standard log levels and provides error handling for console failures.
 *
 * Example usage:
 *   const sink = new ConsoleSink();
 *   sink.write(event);
 */

import { LogEvent } from "./LogEvent";
import { LogSink } from "./LogSink";

// Console sink implementation that writes log events to the console
export class ConsoleSink implements LogSink {
  private styles = {
    Verbose: "color: white;",
    Debug: "color: green",
    Information: "color: blue",
    Warning: "color: yellow",
    Error: "color: red",
    Fatal: "color: palevioletred",
  };
  private consoleMethods = {
    Verbose: (message: string, style: string, args: any) => {
      console.log(message, style, args);
    },
    Debug: (message: string, style: string, args: any) => {
      console.debug(message, style, args);
    },
    Information: (message: string, style: string, args: any) => {
      console.info(message, style, args);
    },
    Warning: (message: string, style: string, args: any) => {
      console.warn(message, style, args);
    },
    Error: (message: string, style: string, args: any) => {
      console.error(message, style, args);
    },
    Fatal: (message: string, style: string, args: any) => {
      console.error(message, style, args);
    },
  };
  // Writes a log event to the console
  // event: The log event to write
  public write(event: LogEvent): void {
    try {
      let displayInlineArgs = event.args && typeof event.args != "object";
      let displayTableArgs = event.args && typeof event.args == "object";
      if (displayTableArgs) {
        let shortenedMessage =
          event.message.length > 200
            ? event.message.substring(0, 200) + "..."
            : event.message;
        shortenedMessage = shortenedMessage.replace(/(\r\n|\n|\r)/gm, " ");
        if (typeof console.groupCollapsed === "function") {
          console.groupCollapsed(shortenedMessage);
        }
      }
      // Robust method lookup and fallback
      const method =
        this.consoleMethods[event.level] ||
        ((msg: string, style: string, args: any) => {
          if (typeof console.log === "function") {
            console.log(msg, style, args);
          }
        });
      // Only use styling if in browser, otherwise omit style
      const isBrowser =
        typeof window !== "undefined" &&
        typeof window.navigator !== "undefined";
      const style = isBrowser ? this.styles[event.level] : "";
      method("%c" + event.message, style, displayInlineArgs ? event.args : "");
      if (displayTableArgs && typeof console.table === "function") {
        console.table(event.args);
        if (typeof console.groupEnd === "function") {
          console.groupEnd();
        }
      }
    } catch (err) {
      if (typeof console.error === "function") {
        console.error("ConsoleSink: Failed to write log event", err, event);
      }
    }
  }
}
