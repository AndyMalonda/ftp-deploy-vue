import 'dotenv/config';
import ftp from 'basic-ftp';
import config from '../../deploy.config.js';

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
        handleError('Failed to connect to FTP server', err);
    }
}

async function navigateToDirectory(client) {
    try {
        await client.cd(config.ftp.path);
        console.log(`Navigated to directory: ${config.ftp.path}`);
    } catch (err) {
        handleError('Failed to navigate to directory', err);
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
        handleError('Failed to purge directory', err);
    }
}

async function uploadDistDirectory(client, distPath) {
    try {
        console.log(`Uploading entire directory: ${distPath}`);
        await client.uploadFromDir(distPath);  // This will upload the entire directory including subdirectories
    } catch (err) {
        handleError('Failed to upload directory', err);
    }
}

function handleError(message, err) {
    throw new Error(`${message}: ${err.message}`);
}