import { ConsoleSink } from "../src/ConsoleSink";
import { LogEvent } from "../src/LogEvent";

describe("ConsoleSink", () => {
  it("should call the correct console method for each log level", () => {
    // Only spy on methods that exist on the global console object
    const levelToConsoleMethod: Record<
      string,
      "log" | "debug" | "info" | "warn" | "error"
    > = {
      Verbose: "log",
      Debug: "debug",
      Information: "info",
      Warning: "warn",
      Error: "error",
      Fatal: "error",
    };
    const levels = Object.keys(levelToConsoleMethod);
    for (const level of levels) {
      const sink = new ConsoleSink();
      const method = levelToConsoleMethod[level];
      const spy = jest.spyOn(console, method).mockImplementation(() => {});
      const event: LogEvent = {
        id: "id",
        timestamp: new Date(),
        level: level as any,
        message: `msg-${level}`,
        exception: undefined,
        properties: {},
        args: undefined,
      };
      sink.write(event);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    }
  });

  it("should handle missing console methods gracefully", () => {
    const sink = new ConsoleSink();
    // Remove 'info' temporarily
    const originalInfo = console.info;
    // @ts-ignore
    delete console.info;
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Information" as any,
      message: "test-info",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    expect(() => sink.write(event)).not.toThrow();
    // Restore
    console.info = originalInfo;
  });

  it("should pass the correct message to the console method", () => {
    // Arrange
    const sink = new ConsoleSink();
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Warning" as any,
      message: "warn-message",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    // Act
    sink.write(event);
    // Assert
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("warn-message"),
      expect.anything()
    );
    spy.mockRestore();
  });

  it("should not throw if the console method throws an error", () => {
    // Arrange
    const sink = new ConsoleSink();
    const spy = jest.spyOn(console, "error").mockImplementation(() => {
      throw new Error("console error");
    });
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Error" as any,
      message: "error-message",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    // Act & Assert
    expect(() => sink.write(event)).not.toThrow();
    spy.mockRestore();
  });
});
