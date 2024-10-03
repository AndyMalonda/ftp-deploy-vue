// deploy.config.template.js
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the dist path from the project's root directory
const distPath = path.resolve(__dirname, 'dist');

export default {
    ftp: {
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        path: process.env.FTP_PATH,
    },
    distPath: distPath
};