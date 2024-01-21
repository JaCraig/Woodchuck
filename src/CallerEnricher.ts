import { LogEvent } from "./LogEvent";
import { LogEventEnricher } from "./LogEventEnricher";

// Enricher that enriches log events with the caller
export class CallerEnricher implements LogEventEnricher {
    // Enriches a log event with the caller
    // event: The log event to enrich
    public enrich(event: LogEvent): void {
        event.properties ??= {};
        let callerUrl = this.matchAll(new Error().stack?.toString() ?? "", /at([\s\w\d\.$]+)[\(]?((http|https|ftp)[^\)\n]+)[\)]?/gi).map(match => match[2].trim());
        event.properties.caller = callerUrl[callerUrl.length - 1];
    }

    // Matches all occurrences of a regular expression in a string
    private matchAll(str: string, regexp: RegExp): RegExpExecArray[] {
        const flags = regexp.global ? regexp.flags : regexp.flags + "g";
        const re = new RegExp(regexp, flags);
        let matches: RegExpExecArray[] = [];
        let match: RegExpExecArray | null;
        while (match = re.exec(str)) {
            matches.push(match);
        }
        return matches;
    }
}
