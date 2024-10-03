import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file and directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../');  // This goes up two levels to reach the root from node_modules

// Define the source and destination paths for both templates
const paths = {
    configTemplate: path.join(__dirname, 'deploy.config.template.js'),
    configDestination: path.join(projectRoot, 'deploy.config.js'),
    deployTemplate: path.join(__dirname, 'deploy.template.js'),
    deployDestination: path.join(projectRoot, 'deploy.js'),
    packageJson: path.join(projectRoot, 'package.json')
};

// Log the paths for debugging
Object.entries(paths).forEach(([key, value]) => console.log(`${key}: ${value}`));

// Function to copy a file
function copyFile(src, dest, description) {
    fs.copyFile(src, dest, (err) => {
        if (err) {
            console.error(`Failed to create ${description}:`, err);
        } else {
            console.log(`${description} has been created successfully.`);
        }
    });
}

function updatePackageJson() {
    fs.readFile(paths.packageJson, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read package.json:', err);
            return;
        }

        try {
            const packageJson = JSON.parse(data);
            packageJson.scripts = packageJson.scripts || {};
            packageJson.scripts.deploy = "npm run build && node deploy.js";

            fs.writeFile(paths.packageJson, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
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
}

copyFile(paths.configTemplate, paths.configDestination, 'deploy.config.js');
copyFile(paths.deployTemplate, paths.deployDestination, 'deploy.js');

updatePackageJson();