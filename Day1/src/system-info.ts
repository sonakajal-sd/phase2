import os from "node:os";

export function getNodeVersion(): string{
    return process.version;
}

export function getOperatingSystem():string{
    return os.platform();
}

export function getMemoryInfo(): {
  totalGB: string;
  freeGB: string;
} {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  const totalGB = (totalMemory / 1024 ** 3).toFixed(2);
  const freeGB = (freeMemory / 1024 ** 3).toFixed(2);

  return {
    totalGB,
    freeGB,
  };
}

export function getCurrentDirectory(): string {
  return process.cwd();
}

export function getNodeEnvironment(): string {
  return process.env.NODE_ENV ?? "not set";
}