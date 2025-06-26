import { DefaultFormatter } from "../src/DefaultFormatter";
import { LogEvent } from "../src/LogEvent";
import { LogEventEnricher } from "../src/LogEventEnricher";
import { LogFilter } from "../src/LogFilter";
import { LoggerConfiguration } from "../src/LoggerConfiguration";

describe("LoggerConfiguration - Filters and Enrichers", () => {
  it("should filter out events below minimum level", () => {
    const sink = { write: jest.fn() };
    const config = new LoggerConfiguration();
    config.minimumLevel("Error").writeTo(sink);
    config.write("Information", "Should not log");
    config.write("Error", "Should log");
    expect(sink.write).toHaveBeenCalledTimes(1);
    expect(sink.write.mock.calls[0][0].level).toBe("Error");
  });

  it("should enrich events with custom enricher", () => {
    const sink = { write: jest.fn() };
    const enricher: LogEventEnricher = {
      enrich: (event) => {
        event.properties.enriched = true;
      },
    };
    const config = new LoggerConfiguration();
    config.enrichWith(enricher).writeTo(sink);
    config.write("Information", "Test");
    expect(sink.write.mock.calls[0][0].properties.enriched).toBe(true);
  });

  it("should filter events using a custom filter", () => {
    const sink = { write: jest.fn() };
    const filter: LogFilter = {
      filter: (event) => event.message.includes("keep"),
    };
    const config = new LoggerConfiguration();
    config.filter(filter).writeTo(sink);
    config.write("Information", "discard this");
    config.write("Information", "keep this");
    expect(sink.write).toHaveBeenCalledTimes(1);
    // The formatter is applied, so check for substring
    expect(sink.write.mock.calls[0][0].message).toContain("keep this");
  });
});

describe("DefaultFormatter - Custom Format", () => {
  it("should format with custom template and properties", () => {
    const formatter = new DefaultFormatter("{Level} - {Message} - {foo}");
    const event: LogEvent = {
      id: "2",
      timestamp: new Date(),
      level: "Debug",
      message: "TestMsg",
      exception: undefined,
      properties: { foo: "bar" },
      args: undefined,
    };
    const result = formatter.format(event);
    expect(result).toContain("Debug - TestMsg - bar");
  });
});
