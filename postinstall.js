import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory of your project
const projectRoot = path.resolve(__dirname, '../../');  // This goes up two levels to reach the root from node_modules

// Define the source and destination paths for both templates
const configTemplatePath = path.join(__dirname, 'deploy.config.template.js');
const configDestinationPath = path.join(projectRoot, 'deploy.config.js');
const deployTemplatePath = path.join(__dirname, 'deploy.template.js');
const deployDestinationPath = path.join(projectRoot, 'deploy.js');

// Log the paths for debugging
console.log('Config Template Path:', configTemplatePath);
console.log('Config Destination Path:', configDestinationPath);
console.log('Deploy Template Path:', deployTemplatePath);
console.log('Deploy Destination Path:', deployDestinationPath);

// Copy the config template file to the destination
fs.copyFile(configTemplatePath, configDestinationPath, (err) => {
    if (err) {
        console.error('Failed to create deploy.config.js:', err);
    } else {
        console.log('deploy.config.js has been created successfully.');
    }
});

// Copy the deploy template file to the destination
fs.copyFile(deployTemplatePath, deployDestinationPath, (err) => {
    if (err) {
        console.error('Failed to create deploy.js:', err);
    } else {
        console.log('deploy.js has been created successfully.');
    }
});

// Update the package.json to include the deploy script
const packageJsonPath = path.join(projectRoot, 'package.json');
fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Failed to read package.json:', err);
        return;
    }

    try {
        const packageJson = JSON.parse(data);
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.deploy = "npm run build && node deploy.js";

        fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Failed to update package.json:', err);
            } else {
                console.log('package.json has been updated with the deploy script.');
            }
        });
    } catch (err) {
        console.error('Failed to parse package.json:', err);
    }
});