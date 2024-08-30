import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const copyFile = promisify(fs.copyFile);

let package1Path: string | null = null;
let package2Path: string | null = null;

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

ipcMain.handle('copy-files', async (event, { files, type }: { files: string[], type: string }) => {
    try {
        if (!package1Path || !package2Path) {
            throw new Error('Package paths are not set.');
        }

        const targetDir = type === 'localUpdated' ? package1Path : package2Path;

        for (const fileName of files) {
            const sourcePath = path.join(__dirname, fileName);
            const targetPath = path.join(targetDir, fileName);
            await copyFile(sourcePath, targetPath);
        }

        return { success: true };
    } catch (error) {
        console.error('Error copying files:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
});

ipcMain.handle('set-package-paths', (event, { package1Path: path1, package2Path: path2 }: { package1Path: string, package2Path: string }) => {
    package1Path = path1;
    package2Path = path2;
    return { success: true };
});

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
