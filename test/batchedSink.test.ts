import { BatchedSink } from "../src/BatchedSink";
import { BatchedSinkOptions } from "../src/BatchedSinkOptions";
import { LogEvent } from "../src/LogEvent";

describe("BatchedSink", () => {
  it("should buffer events and flush when maxBatchSize is reached", () => {
    const sink = { write: jest.fn() };
    const options = new BatchedSinkOptions();
    options.maxBatchSize = 2;
    options.storage = { setItem: jest.fn(), getItem: () => "[]" } as any;
    const batchedSink = new BatchedSink(sink, options);
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Information",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    batchedSink.write(event);
    expect(sink.write).not.toHaveBeenCalled();
    batchedSink.write(event);
    expect(sink.write).toHaveBeenCalledTimes(2);
  });
});
