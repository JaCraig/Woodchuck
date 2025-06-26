import { LogEvent } from "./LogEvent";
import { LogSink } from "./LogSink";

// Console sink implementation that writes log events to the console
export class ConsoleSink implements LogSink {
    private styles = {
        "Verbose": "color: white;",
        "Debug": "color: green",
        "Information": "color: blue",
        "Warning": "color: yellow",
        "Error": "color: red",
        "Fatal": "color: palevioletred"
    };
    private consoleMethods = {
        "Verbose": (message: string, style: string, args: any) => { console.log(message, style, args); },
        "Debug": (message: string, style: string, args: any) => { console.debug(message, style, args); },
        "Information": (message: string, style: string, args: any) => { console.info(message, style, args); },
        "Warning": (message: string, style: string, args: any) => { console.warn(message, style, args); },
        "Error": (message: string, style: string, args: any) => { console.error(message, style, args); },
        "Fatal": (message: string, style: string, args: any) => { console.error(message, style, args); }
    };
    // Writes a log event to the console
    // event: The log event to write
    public write(event: LogEvent): void {
        try {
            let displayInlineArgs = (event.args && (typeof event.args != "object"));
            let displayTableArgs = (event.args && (typeof event.args == "object"));
            if(displayTableArgs) {
                let shortenedMessage = event.message.length > 200 ? event.message.substring(0, 200) + "..." : event.message;
                shortenedMessage = shortenedMessage.replace(/(\r\n|\n|\r)/gm, " ");
                console.groupCollapsed(shortenedMessage);
            }
            this.consoleMethods[event.level]("%c" + event.message, this.styles[event.level], displayInlineArgs ? event.args : "");
            if (displayTableArgs) {
                console.table(event.args);
                console.groupEnd();
            }
        } catch (err) {
            console.error("ConsoleSink: Failed to write log event", err, event);
        }
    }
}
