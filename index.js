import 'dotenv/config';
import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../deploy.config.js'; // Adjust the path as necessary

// Get the current directory name (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the dist path from the configuration
const distPath = config.distPath;

export async function purgeAndDeploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await connectToFtp(client);
        await navigateToDirectory(client);
        await purgeDirectory(client);
        await uploadDistDirectory(client, distPath);
        console.log('Deployment complete!');
    } catch (err) {
        console.error('Deployment failed:', err);
    } finally {
        client.close();
    }
}

async function connectToFtp(client) {
    try {
        await client.access({
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password,
            secure: false
        });
        console.log('Connected to FTP server');
    } catch (err) {
        throw new Error('Failed to connect to FTP server: ' + err.message);
    }
}

async function navigateToDirectory(client) {
    try {
        await client.cd(config.ftp.path);
        console.log(`Navigated to directory: ${config.ftp.path}`);
    } catch (err) {
        throw new Error('Failed to navigate to directory: ' + err.message);
    }
}

async function purgeDirectory(client) {
    try {
        const files = await client.list();
        for (const file of files) {
            if (file.isDirectory) {
                await client.removeDir(file.name);  // Recursively remove directories
            } else {
                await client.remove(file.name);  // Remove files
            }
        }
        console.log('Purged directory');
    } catch (err) {
        throw new Error('Failed to purge directory: ' + err.message);
    }
}

async function uploadDistDirectory(client, distPath) {
    try {
        console.log(`Uploading entire directory: ${distPath}`);
        await client.uploadFromDir(distPath);  // This will upload the entire directory including subdirectories
    } catch (err) {
        throw new Error('Failed to upload directory: ' + err.message);
    }
}