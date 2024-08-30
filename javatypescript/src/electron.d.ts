declare global {
    interface Window {
        myAPI: {
            openDirectoryDialog(): Promise<string[]>;
            readFilesFromDirectory(directoryPath: string): Promise<DirectoryFile[]>;
            copyFiles(args: { files: string[]; type: string }): Promise<{ success: boolean; error?: string }>;
            setPackagePaths(args: { package1Path: string; package2Path: string }): Promise<{ success: boolean }>;
        };
    }
}

export {};