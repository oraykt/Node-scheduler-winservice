import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import logger from './logger';

interface Config {
  job: string;
  arguments: string[];
  error: boolean;
}

const configPath = join(__dirname, 'config.json');

function readConfig(): Config | null {
  if (!existsSync(configPath)) {
    logger.error('Configuration file not found!');
    return null;
  }
  try {
    const configData = readFileSync(configPath, 'utf-8');
    logger.info('Configuration file loaded successfully.');
    return JSON.parse(configData) as Config;
  } catch (error) {
    logger.error(`Error reading configuration file: ${(error as Error).message}`);
    return null;
  }
}

function executeJob(): void {
  const config = readConfig();
  if (!config || config.error) {
    logger.warn('Skipping job execution due to error flag or invalid configuration.');
    return;
  }

  const { job, arguments: args } = config;

  if (!job) {
    logger.error('No job specified in the configuration file.');
    return;
  }

  logger.info(`Executing job: ${job} with arguments: ${args.join(' ')}`);

  const jobParts = job.split(' ');
  const command = jobParts[0];
  const jobArgs = [...jobParts.slice(1), ...args];

  const child = spawn(command, jobArgs, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    logger.error(`Error executing job: ${(err as Error).message}`);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      logger.error(`Job exited with code ${code}`);
    } else {
      logger.info('Job executed successfully.');
    }
  });
}

function monitorAndExecute(): void {
  setInterval(() => {
    logger.info('Monitoring configuration and triggering job if applicable...');
    executeJob();
  }, 5000); // Check every 5 seconds
}

monitorAndExecute();
