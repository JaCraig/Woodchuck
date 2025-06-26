import { DefaultFormatter } from "../src/DefaultFormatter";
import { LogEvent } from "../src/LogEvent";
import { LoggerConfiguration } from "../src/LoggerConfiguration";

describe("LoggerConfiguration", () => {
    it("should create a pipeline and write to a sink", () => {
        const sink = { write: jest.fn() };
        const config = new LoggerConfiguration();
        config.minimumLevel("Information").writeTo(sink);
        config.write("Information", "Test message");
        expect(sink.write).toHaveBeenCalled();
    });

    it("should support custom properties in log events", () => {
        const sink = { write: jest.fn() };
        const config = new LoggerConfiguration();
        config.writeTo(sink);
        config.write("Debug", "Test", { foo: "bar" });
        expect(sink.write.mock.calls[0][0].args.foo).toBe("bar");
    });
});

describe("DefaultFormatter", () => {
    it("should format log events with default template", () => {
        const formatter = new DefaultFormatter();
        const event: LogEvent = {
            id: "1",
            timestamp: new Date(0),
            level: "Information",
            message: "Hello",
            exception: undefined,
            properties: {},
            args: undefined
        };
        const result = formatter.format(event);
        expect(result).toContain("1970");
        expect(result).toContain("Information");
        expect(result).toContain("Hello");
    });
});
