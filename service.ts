import { Service } from 'node-windows';
import { join } from 'path';
import logger from './logger';

const svcName = 'Node Job Runner Service';
const svcDescription = 'A Windows Service to run jobs defined in a JSON configuration file.';
const scriptPath = join(__dirname, 'worker.js');

const svc = new Service({
  name: svcName,
  description: svcDescription,
  script: scriptPath,
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
});

const action = process.argv[2];

function exitWithError(message: string): void {
  logger.error(message);
  console.error(`Error: ${message}`);
  process.exit(1);
}

switch (action) {
  case 'install':
    svc.on('alreadyinstalled', () => {
      exitWithError(`Service "${svcName}" is already installed.`);
    });

    svc.on('install', () => {
      logger.info(`Service "${svcName}" installed successfully.`);
      console.log(`Service "${svcName}" installed successfully.`);
      svc.start();
    });

    logger.info(`Installing service "${svcName}"...`);
    console.log(`Installing service "${svcName}"...`);
    svc.install();
    break;

  case 'uninstall':
    svc.on('notinstalled', () => {
      exitWithError(`Service "${svcName}" is not installed.`);
    });

    svc.on('uninstall', () => {
      logger.info(`Service "${svcName}" uninstalled successfully.`);
      console.log(`Service "${svcName}" uninstalled successfully.`);
    });

    logger.info(`Uninstalling service "${svcName}"...`);
    console.log(`Uninstalling service "${svcName}"...`);
    svc.uninstall();
    break;

  default:
    logger.info('Invalid command. Usage: install or uninstall.');
    console.log(`
Usage:
  node dist/service.js install     - Install the service
  node dist/service.js uninstall   - Uninstall the service
    `);
    process.exit(0);
}
