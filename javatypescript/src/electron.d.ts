declare global {
    interface Window {
        myAPI: {
            copyFiles(args: { files: string[]; type: string }): Promise<{ success: boolean; error?: string }>;
            setPackagePaths(args: { package1Path: string; package2Path: string }): Promise<{ success: boolean }>;
        };
    }
}

export {};
