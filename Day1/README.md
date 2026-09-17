# System Information CLI

A simple Node.js and TypeScript command-line application that displays system and runtime information such as Node.js version, operating system, memory usage, current directory, and environment.

## Features

* Display Node.js version
* Display operating system information
* Display total and free memory
* Display the current working directory
* Display the `NODE_ENV` environment variable
* Handle invalid or missing commands
* Written in strict TypeScript
* Includes Jest tests

## Installation

Clone the repository and install the project dependencies:


 npm install
 

This installs all required dependencies listed in `package.json`.

## Build

Compile the TypeScript source code into JavaScript:

 npm run build

The compiled JavaScript files are generated inside the `dist` directory.

## Run

Run the CLI using:

 npm start <command>

### Available Commands

#### Node.js Version

 npm start version

Displays the current Node.js version.

#### Operating System

 npm start os

Displays the operating system platform.

#### Memory

 npm start memory
 
Displays total and free system memory.

#### Current Directory

 npm start cwd

Displays the current working directory from which the Node.js process was started.

#### Environment

 npm start env

Displays the current `NODE_ENV` value.

Example:

NODE_ENV=development npm start env

Output:

```text
NODE_ENV: development
```

If `NODE_ENV` is not set, the application displays:

```text
NODE_ENV: not set
```

## Development

The project provides a development script:

```bash
npm run dev
```

## Testing

Run the Jest test suite with:

```bash
npm test
```

The project includes tests for:

* Node.js version
* Operating system
* Memory information
* Current directory
* Node environment

All tests should pass before considering the project ready.

## Invalid Commands

If an unknown command is provided, the CLI displays an error message and lists the available commands.

Example:

```bash
npm start hello
```

Output:

```text
Unknown command: hello
Available commands: version | os | memory | cwd | env
```

If no command is provided:

```bash
npm start
```

The CLI asks the user to provide a command and displays the available commands.

## Project Structure

```text
Day1/
├── src/
│   ├── index.ts
│   ├── system-info.ts
│   └── system-info.test.ts
├── dist/
├── package.json
├── package-lock.json
├── tsconfig.json
└── jest.config.js
```

### File Responsibilities

* `src/index.ts` — Parses the CLI command and displays the output.
* `src/system-info.ts` — Contains reusable functions for collecting system information.
* `src/system-info.test.ts` — Contains Jest tests for the system information functions.
* `dist/` — Contains the compiled JavaScript output.
* `package.json` — Contains project metadata, dependencies, and npm scripts.
* `package-lock.json` — Locks the resolved dependency versions.
* `tsconfig.json` — Contains TypeScript compiler configuration.
* `jest.config.js` — Contains Jest configuration.

## Architecture

The application separates command handling from system information collection.

### Command Handling

`src/index.ts` is responsible for:

1. Reading the command from `process.argv`
2. Identifying the requested command
3. Calling the appropriate function
4. Displaying the result
5. Handling invalid or missing commands

### Data Collection

`src/system-info.ts` contains reusable functions that collect system information.

This separation makes the functions easier to test and reuse.

## TypeScript Configuration

The project uses strict TypeScript configuration.

Important settings include:

* `strict: true` — Enables strict type checking.
* `rootDir: "./src"` — Defines the source directory.
* `outDir: "./dist"` — Defines the compiled output directory.
* `target: "ES2022"` — Specifies the JavaScript target.
* `module: "NodeNext"` — Configures Node.js module behavior.
* `types: ["node"]` — Provides Node.js type definitions.

## NPM Scripts

The project provides the following npm scripts:

```text
npm run build    → Compile TypeScript
npm start        → Run the compiled application
npm run dev      → Run the development command
npm test         → Run Jest tests
```

## Requirements

* Node.js
* npm

Check your installed versions:

```bash
node --version
npm --version
```

## Example Workflow

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Run a command:

```bash
npm start version
```

Run the tests:

```bash
npm test
```

## License

This project is created for learning and training purposes.
