import { Service } from 'node-windows';
import { join } from 'path';

const svcName = 'Node Job Runner Service';
const svcDescription = 'A Windows Service to run jobs defined in a JSON configuration file.';
const scriptPath = join(__dirname, 'worker.js');

// Create the service
const svc = new Service({
  name: svcName,
  description: svcDescription,
  script: scriptPath,
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
});

// Parse command-line arguments
const action = process.argv[2];

// Utility function to handle errors and exit
function exitWithError(message: string): void {
  console.error(`Error: ${message}`);
  process.exit(1);
}

// Implement command handling
switch (action) {
  case 'install':
    // Check if the service is already installed
    svc.on('alreadyinstalled', () => {
      exitWithError(`Service "${svcName}" is already installed.`);
    });

    // Listen for the install event
    svc.on('install', () => {
      console.log(`Service "${svcName}" installed successfully.`);
      svc.start();
    });

    // Install the service
    console.log(`Installing service "${svcName}"...`);
    svc.install();
    break;

  case 'uninstall':
    // Check if the service is not installed
    svc.on('notinstalled', () => {
      exitWithError(`Service "${svcName}" is not installed.`);
    });

    // Listen for the uninstall event
    svc.on('uninstall', () => {
      console.log(`Service "${svcName}" uninstalled successfully.`);
    });

    // Uninstall the service
    console.log(`Uninstalling service "${svcName}"...`);
    svc.uninstall();
    break;

  default:
    console.log(`
Usage:
  node dist/service.js install     - Install the service
  node dist/service.js uninstall   - Uninstall the service
    `);
    process.exit(0);
}
