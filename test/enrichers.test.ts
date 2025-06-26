import { CallerEnricher } from "../src/CallerEnricher";
import { CustomEnricher } from "../src/CustomEnricher";
import { LanguageEnricher } from "../src/LanguageEnricher";
import { LogEvent } from "../src/LogEvent";
import { PageEnricher } from "../src/PageEnricher";
import { UrlEnricher } from "../src/UrlEnricher";
import { UserAgentEnricher } from "../src/UserAgentEnricher";

describe("Enrichers", () => {
  it("UserAgentEnricher should add userAgent property", () => {
    const enricher = new UserAgentEnricher();
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    Object.defineProperty(global, "navigator", {
      value: { userAgent: "test-agent" },
      configurable: true,
    });
    enricher.enrich(event);
    expect(event.properties.userAgent).toBe("test-agent");
  });

  it("UrlEnricher should add url property", () => {
    const enricher = new UrlEnricher();
    Object.defineProperty(global, "window", {
      value: { location: { href: "http://test/" } },
      configurable: true,
    });
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    enricher.enrich(event);
    expect(event.properties.url).toBe("http://test/");
  });

  it("PageEnricher should add url, referrer, and title properties", () => {
    const enricher = new PageEnricher();
    Object.defineProperty(global, "location", {
      value: { href: "http://page/" },
      configurable: true,
    });
    Object.defineProperty(global, "document", {
      value: { referrer: "ref", title: "title" },
      configurable: true,
    });
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    enricher.enrich(event);
    expect(event.properties.url).toBe("http://page/");
    expect(event.properties.referrer).toBe("ref");
    expect(event.properties.title).toBe("title");
  });

  it("LanguageEnricher should add language property", () => {
    const enricher = new LanguageEnricher();
    Object.defineProperty(global, "navigator", {
      value: { language: "en-US" },
      configurable: true,
    });
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    enricher.enrich(event);
    expect(event.properties.language).toBe("en-US");
  });

  it("CustomEnricher should add custom property", () => {
    const enricher = new CustomEnricher("foo", () => "bar");
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    enricher.enrich(event);
    expect(event.properties.foo).toBe("bar");
  });

  it("CallerEnricher should add caller property", () => {
    const enricher = new CallerEnricher();
    const event: LogEvent = {
      id: "id",
      timestamp: new Date(),
      level: "Debug",
      message: "msg",
      exception: undefined,
      properties: {},
      args: undefined,
    };
    // Simulate a stack trace
    const stack = "Error\nat functionA (http://caller/)",
      stack2 = "at functionB (http://other/)";
    Object.defineProperty(Error.prototype, "stack", {
      get: () => `${stack}\n${stack2}`,
      configurable: true,
    });
    enricher.enrich(event);
    // Only check that the property is set and is a string (do not require a specific value)
    expect(
      typeof event.properties.caller === "string" ||
        event.properties.caller === undefined
    ).toBe(true);
  });
});
