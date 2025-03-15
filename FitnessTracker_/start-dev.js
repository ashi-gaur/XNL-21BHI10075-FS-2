const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_OPTIONS = '--no-warnings --experimental-specifier-resolution=node';

// Windows-compatible path resolution
const serverPath = path.resolve(__dirname, 'server', 'index.ts');

// Run tsx with server index file
const tsx = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true
});

tsx.on('error', (err) => {
  console.error('Failed to start tsx:', err);
});

process.on('SIGINT', () => {
  tsx.kill('SIGINT');
  process.exit(0);
});