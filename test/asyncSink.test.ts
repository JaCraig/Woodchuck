import { BatchedSink } from "../src/BatchedSink";
import { BatchedSinkOptions } from "../src/BatchedSinkOptions";
import { LogEvent } from "../src/LogEvent";
import { LoggerConfiguration } from "../src/LoggerConfiguration";

describe("Async sink support", () => {
  it("should call an async sink's write method without throwing", () => {
    const sink = {
      write: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    const config = new LoggerConfiguration();
    config.writeTo(sink as any);
    expect(() => config.write("Information", "async test")).not.toThrow();
    expect(sink.write).toHaveBeenCalled();
  });

  it("should handle rejected promises from async sinks and log errors", async () => {
    const sink = {
      write: jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error("boom"))),
    };
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const config = new LoggerConfiguration();
    config.writeTo(sink as any);
    config.write("Information", "async fail");
    // allow microtasks to run
    await new Promise((r) => setTimeout(r, 0));
    expect(sink.write).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("BatchedSink.flush should handle async sink promises without throwing", async () => {
    const sink = {
      write: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    const options = new BatchedSinkOptions();
    options.maxBatchSize = 10;
    options.storage = { setItem: jest.fn(), getItem: () => "[]" } as any;
    const batched = new BatchedSink(sink as any, options);
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Information",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    batched.write(event);
    // flush explicitly
    expect(() => batched.flush()).not.toThrow();
    // give microtasks a tick
    await new Promise((r) => setTimeout(r, 0));
    expect(sink.write).toHaveBeenCalled();
    batched.close();
  });
});
