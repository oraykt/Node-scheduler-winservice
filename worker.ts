import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Config {
  job: string;
  arguments: string[];
  error: boolean;
}

const configPath = join(__dirname, 'config.json');

// Function to read the configuration file
function readConfig(): Config | null {
  if (!existsSync(configPath)) {
    console.error('Configuration file not found!');
    return null;
  }
  try {
    const configData = readFileSync(configPath, 'utf-8');
    return JSON.parse(configData) as Config;
  } catch (error) {
    console.error('Error reading configuration file:', (error as Error).message);
    return null;
  }
}

// Function to execute the specified job
function executeJob(): void {
  const config = readConfig();
  if (!config || config.error) {
    console.error('Skipping execution due to error flag or invalid configuration.');
    return;
  }

  const { job, arguments: args } = config;

  if (!job) {
    console.error('No job specified in the configuration file.');
    return;
  }

  console.log(`Executing job: ${job} with arguments: ${args.join(' ')}`);

  const jobParts = job.split(' ');
  const command = jobParts[0];
  const jobArgs = [...jobParts.slice(1), ...args];

  const child = spawn(command, jobArgs, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (err) => {
    console.error(`Error executing job: ${(err as Error).message}`);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Job exited with code ${code}`);
    } else {
      console.log('Job executed successfully.');
    }
  });
}

// Periodically monitor configuration and trigger job
function monitorAndExecute(): void {
  setInterval(() => {
    console.log('Monitoring configuration...');
    executeJob();
  }, 5000); // Check every 5 seconds
}

// Start the worker
monitorAndExecute();
