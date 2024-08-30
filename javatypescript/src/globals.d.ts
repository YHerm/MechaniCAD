import { IpcRenderer } from 'electron';

declare global {
    interface Window {
        myAPI: {
            copyFiles: (data: { files: string[], type: string }) => Promise<{ success: boolean, error?: string }>;
        };
    }
}

export {};  // Required to make the file a module
