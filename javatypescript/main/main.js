const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const copyFile = promisify(fs.copyFile);

let package1Path = '/path/to/package1'; // Set this dynamically as needed
let package2Path = '/path/to/package2'; // Set this dynamically as needed

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false
        }
    });

    mainWindow.loadFile('path/to/packageCompare.html'); // Adjust this path as needed
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle file copying via IPC
ipcMain.handle('copy-files', async (event, { files, type }) => {
    try {
        const targetDir = type === 'localUpdated' ? package1Path : package2Path;

        for (const fileName of files) {
            const sourcePath = path.join(__dirname, fileName); 
            const targetPath = path.join(targetDir, fileName);
            await copyFile(sourcePath, targetPath);
        }

        return { success: true };
    } catch (error) {
        console.error('Error copying files:', error);
        return { success: false, error: error.message };
    }
});
