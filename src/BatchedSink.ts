import { BatchedSinkOptions } from "./BatchedSinkOptions";
import { LogEvent } from "./LogEvent";
import { LogSink } from "./LogSink";

// Batched sink that stores log events in a buffer and writes them to another sink in batches
export class BatchedSink implements LogSink {
    // The options for the batched sink
    public constructor(sink: LogSink, options: BatchedSinkOptions) {
        this.sink = sink;
        this.options = options;
        this.timer = setInterval(() => this.flush(), this.options.maxWaitTime);
        this.buffer = <LogEvent[]>JSON.parse(this.options.storage.getItem("logBuffer") || "[]");
    }

    // The buffer of log events
    private buffer: LogEvent[] = [];

    // The sink to write the log events to
    private sink: LogSink;

    // The options for the batched sink
    private options: BatchedSinkOptions;

    // The timer to flush the buffer
    private timer: number;

    // flushes the buffer to the underlying sink
    private flush(): void {
        if (this.buffer.length == 0) {
            return;
        }
        for (let event of this.buffer) {
            this.sink.write(event);
        }
        this.buffer = [];
    }

    // Writes a log event to the buffer
    // event: The log event to write
    public write(event: LogEvent): void {
        this.buffer.push(event);
        this.options.storage.setItem("logBuffer", JSON.stringify(this.buffer));
        if (this.buffer.length >= this.options.maxBatchSize) {
            this.flush();
        }
    }
}