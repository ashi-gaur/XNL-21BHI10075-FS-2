/**
 * Windows-specific entry point for the server
 * This file is meant to be used on Windows systems to avoid ESM URL scheme issues
 */

// Set Node.js to use CommonJS-style module resolution
// @ts-expect-error - Setting process env variable
process.env.NODE_OPTIONS = '--no-warnings --experimental-specifier-resolution=node';

// Import and run the server normally
import('./index.ts').then(() => {
  console.log('Server started successfully via windows-entry.ts');
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});