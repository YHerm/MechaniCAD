// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose specific functionalities to the renderer process
contextBridge.exposeInMainWorld('myAPI', {
    // Example function to call a method in the main process
    doSomething: () => ipcRenderer.invoke('do-something'),
    // Example variable to access from the renderer
    someValue: 'This is a value from preload'
});