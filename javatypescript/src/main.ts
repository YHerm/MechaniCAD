import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Promisify fs operations
const copyFile = promisify(fs.copyFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// Variables to hold package paths
let package1Path: string | null = null;
let package2Path: string | null = null;

// Function to create the main window
function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
        }
    });

    mainWindow.loadFile('../html/Page1.html');
    mainWindow.webContents.openDevTools();
}

// IPC handler to open directory dialog
ipcMain.handle('dialog:openDirectory', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections']
    });
    return result.filePaths;
});

// IPC handler to read files from a directory
ipcMain.handle('read-files-from-directory', async (event, directoryPath: string) => {
    try {
        const files = await readdir(directoryPath, { withFileTypes: true });
        const fileData = await Promise.all(files.filter(file => file.isFile()).map(async (file) => {
            const filePath = path.join(directoryPath, file.name);
            const stats = await stat(filePath);
            return {
                name: file.name,
                path: filePath,
                lastModified: stats.mtimeMs
            };
        }));
        return fileData;
    } catch (error) {
        console.error('Failed to read files from directory:', error);
        return [];
    }
});

// IPC handler to copy files
ipcMain.handle('copy-files', async (event, { files, type }: { files: string[], type: string }) => {
    try {
        if (!package1Path || !package2Path) {
            throw new Error('Package paths are not set.');
        }

        const currentDir = type === 'localUpdated' ? package1Path : package2Path;
        const targetDir = type === 'localUpdated' ? package2Path : package1Path;

        for (const fileName of files) {
            const sourcePath = path.join(currentDir, fileName);
            const targetPath = path.join(targetDir, fileName);
            await copyFile(sourcePath, targetPath);
        }

        return { success: true };
    } catch (error) {
        console.error('Error copying files:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});

// IPC handler to set package paths
ipcMain.handle('set-package-paths', (event, { package1Path: path1, package2Path: path2 }: { package1Path: string, package2Path: string }) => {
    package1Path = path1;
    package2Path = path2;
    return { success: true };
});

// Create the window once the app is ready
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit the app when all windows are closed, unless on macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
