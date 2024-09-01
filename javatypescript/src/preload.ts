import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
    openDirectoryDialog: () => ipcRenderer.invoke('dialog:openDirectory'),
    readFilesFromDirectory: (path: string) => ipcRenderer.invoke('read-files-from-directory', path),
    copyFiles: (args: { files: string[]; type: string }) => ipcRenderer.invoke('copy-files', args),
    setPackagePaths: (args: { package1Path: string; package2Path: string }) => ipcRenderer.invoke('set-package-paths', args)
});
