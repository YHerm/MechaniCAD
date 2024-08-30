import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
    copyFiles: (args: { files: string[], type: string }) => ipcRenderer.invoke('copy-files', args),
    setPackagePaths: (paths: { package1Path: string, package2Path: string }) => ipcRenderer.invoke('set-package-paths', paths)
});
