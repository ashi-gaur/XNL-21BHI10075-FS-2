import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to resolve paths relative to project root
export function resolveProjectPath(relativePath: string): string {
  // Go up one level from server directory to project root
  const projectRoot = dirname(__dirname);
  const absolutePath = join(projectRoot, relativePath);
  
  // Verify the path exists
  if (!fs.existsSync(absolutePath)) {
    console.warn(`Warning: Path ${absolutePath} does not exist`);
  }
  
  // Convert to file:// URL for ESM compatibility
  return pathToFileURL(absolutePath);
}

// Convert a file path to a file:// URL
function pathToFileURL(path: string): string {
  // Windows paths need special handling
  if (process.platform === 'win32') {
    // Normalize backslashes to forward slashes and ensure proper file:// format
    const normalizedPath = path.replace(/\\/g, '/');
    // Ensure path starts with a leading slash after the drive letter
    if (/^[a-zA-Z]:/.test(normalizedPath)) {
      return `file:///${normalizedPath}`;
    }
    return `file:///${normalizedPath}`;
  }
  
  // Unix paths
  return `file://${path}`;
}