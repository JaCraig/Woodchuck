import { LogEvent } from "../src/LogEvent";
import { MinimumLevelLogFilter } from "../src/MinimumLevelLogFilter";

describe("MinimumLevelLogFilter", () => {
  it("should allow events at or above the minimum level", () => {
    const filter = new MinimumLevelLogFilter("Warning");
    const allowed: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Error",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    expect(filter.filter(allowed)).toBe(true);
  });

  it("should block events below the minimum level", () => {
    const filter = new MinimumLevelLogFilter("Error");
    const blocked: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    expect(filter.filter(blocked)).toBe(false);
  });
});
