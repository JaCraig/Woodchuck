# WoodChuck - Logging Library

[![NPM Publish](https://github.com/JaCraig/Woodchuck/actions/workflows/node-publish.yml/badge.svg)](https://github.com/JaCraig/Woodchuck/actions/workflows/node-publish.yml)

WoodChuck is a versatile logging library for TypeScript/JavaScript that simplifies the process of logging messages within your applications and is built with structured event data at its heart. It provides a flexible and extensible logging framework to help you track and understand the flow of your application.

## Features

- **Easy Integration**: Simple setup for quick integration into your projects.

- **Customizable Logging Levels**: Define and use different logging levels to categorize and filter messages.

- **Extensible Plugins**: Extend functionality with plugins for various output formats and destinations.

- **Structured Logging**: Log structured event data to make it easier to analyze and understand.

- **Flexible Configuration**: Configure the logger with a fluent interface to customize the logging experience.

## Installation

```bash
npm i @jacraig/woodchuck
```

## Usage

1. Configure the logger with a sink to output to.

```typescript

import { Logger, ConsoleSink } from '@jacraig/woodchuck';

Logger.configure()
    .minimumLevel("Information")
    .writeTo(new ConsoleSink())
    .build();

```

2. Log messages with different levels:

```typescript

Logger.verbose("This is a verbose message: {key}", { "key": "value" });
Logger.debug("This is a debug message: {key}", { "key": "value" });
Logger.information("This is an information message: {key}", { "key": "value" });
Logger.warning("This is a warning message: {key}", { "key": "value" });
Logger.error("This is an error message: {key}", { "key": "value" }, new Error("This is an error"));
Logger.fatal("This is a fatal message: {key}", { "key": "value" }, new Error("This is a fatal error"));

```

3. Customize the logger with plugins:

```typescript

Logger.configure()
    .enrichWith(new UserAgentEnricher())
    .enrichWith(new UrlEnricher())
    .enrichWith(new CallerEnricher())
    .formatUsing(new DefaultFormatter())
    .minimumLevel("Information")
    .writeTo(new ConsoleSink());

```
4. Or build your own plugins:

```typescript

import { LogEventEnricher, LogEvent } from '@jacraig/woodchuck';

export class MyCustomPlugin implements LogEventEnricher {
    public enrich(logEvent: LogEvent): void {
        logEvent.properties["myProperty"] = "Something, something, something, dark side";
    }
}

```

# Contributing
If you'd like to contribute to WoodChuck, please follow our [contribution guidelines](https://github.com/JaCraig/Woodchuck/blob/main/CONTRIBUTING.md).

# License
WoodChuck is licensed under the [Apache 2 License](https://github.com/JaCraig/Woodchuck/blob/main/LICENSE).