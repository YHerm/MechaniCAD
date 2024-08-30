import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myAPI', {
    copyFiles: (args) => ipcRenderer.invoke('copy-files', args)
});
