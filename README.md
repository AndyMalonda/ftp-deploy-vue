# FTP Deployment Script

This package provides a utility to deploy Vue application files to an FTP server. It connects to the FTP server, navigates to a specified directory, purges the existing content, and uploads new files from a local `dist` directory.

## Features

- Connects to an FTP server using credentials from a configuration file.
- Navigates to a specified directory on the FTP server.
- Purges (deletes) all existing content in the target directory.
- Uploads the entire content of the local `dist` directory to the target directory on the FTP server.

## Warning

**This script will delete all existing content in the target directory on the FTP server before uploading new files.** Ensure that you have backups or are aware of the consequences before running this script.

## Installation

1. Install the package using npm:

    ```sh
    npm install ftp-deploy-vue
    ```

2. After installation, `deploy.config.js` and `deploy.js` files will be created in the root directory of your project. Edit the `.env` file to add the necessary FTP server credentials and target directory path:

    ```env
    FTP_HOST=your-ftp-host
    FTP_USER=your-ftp-username
    FTP_PASSWORD=your-ftp-password
    FTP_PATH=/path/on/ftp/server
    ```

## Usage

To deploy files to the FTP server, run the following command:

```sh
npm run deploy
```