# Node Job Runner Service for Windows

A Node.js application that runs as a Windows Service to execute configurable jobs defined in a JSON configuration file. Built with TypeScript and Node.js 18.

## Features

- Executes custom commands (jobs) defined in a `config.json` file.
- Supports passing arguments to jobs.
- Runs as a Windows Service in the background.
- Periodically checks the configuration file for updates.
- Built with TypeScript for type safety and maintainability.

## Project Structure

```
project/
│
├── worker.ts       // Main script to handle job execution
├── service.ts      // Script to create and manage the Windows Service
├── config.json     // Configuration file for the job
├── package.json    // Project metadata and dependencies
├── tsconfig.json   // TypeScript configuration
```

## Prerequisites

1. Install [Node.js](https://nodejs.org/) (version 18 or higher).
2. Ensure you have administrator privileges to install Windows Services.
3. Install TypeScript globally if not already installed:
   ```bash
   npm install -g typescript
   ```

## Installation

1. Clone the repository or copy the files into a project directory.
2. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```

3. Compile the TypeScript files to JavaScript:
   ```bash
   npx tsc
   ```

## Configuration

Edit the `config.json` file to define the job and arguments:

```json

  {
    "job": "node app.js",
    "arguments": ["-title=demo"],
    "error": false
  }

```

- `job`: Command to execute (e.g., `node app.js`).
- `arguments`: List of arguments to pass to the job.
- `error`: Set to `true` to skip execution (useful for temporary disabling).

## Running the Service

### Install the Service

Run the following command to install the service:

```bash
node dist/service.js install
```

#### Alternatively

You can also run the following command to install the service:

```bash
npm run service-install
```

### Start the Service

The service will start automatically upon installation. You can also manage it via Windows Services.

### Uninstall the Service

Run the following command to unnstall the service:

```bash
node dist/service.js uninstall
```

#### Alternatively

You can also run the following command to install the service:

```bash
npm run service-uninstall
```

## Development

- To run the job script manually during development:
  ```bash
  node dist/worker.js
  ```

- To rebuild after making changes:
  ```bash
  npx tsc
  ```

## Scripts

- **Build**: Compiles TypeScript to JavaScript:
  ```bash
  npm run build
  ```

- **Start Worker**: Runs the worker script manually:
  ```bash
  npm run start
  ```

- **Install Service**: Installs the Windows Service:
  ```bash
  npm run service-install
  ```

## License

MIT License

---

## Author

Oray Kurt - [@oraykt](https://github.com/oraykt)
