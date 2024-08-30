// Define an interface for file data returned from the main process
interface FileData {
    name: string;
    path: string;
    lastModified: number; // Use a number to represent last modified time
}

// Function to open directory dialog and set the directory path
async function openDirectoryDialogForPackage(packageId: string): Promise<void> {
    try {
        const filePaths: string[] = await window.myAPI.openDirectoryDialog();

        if (filePaths.length > 0) {
            const rootDirectoryPath = getRootDirectory(filePaths);
            const inputElement = document.getElementById(packageId) as HTMLInputElement;
            inputElement.value = rootDirectoryPath;
        }
    } catch (error) {
        console.error('Failed to open directory dialog:', error);
    }
}

// Function to extract the root directory from file paths
function getRootDirectory(filePaths: string[]): string {
    if (filePaths.length === 0) return '';

    const rootPathSegments = filePaths[0].split('/');
    let rootDirectory = rootPathSegments[0];

    for (const filePath of filePaths) {
        const pathSegments = filePath.split('/');
        if (pathSegments[0] !== rootDirectory) {
            rootDirectory = '';
            break;
        }
    }

    return rootDirectory;
}

// Function to handle package comparison
async function handlePackageComparison(): Promise<void> {
    try {
        const package1Path = (document.getElementById('Package1') as HTMLInputElement).value;
        const package2Path = (document.getElementById('Package2') as HTMLInputElement).value;

        if (!package1Path || !package2Path) {
            alert('Please select directories for both packages.');
            return;
        }

        const package1Files = await readFilesFromDirectory(package1Path);
        const package2Files = await readFilesFromDirectory(package2Path);

        const result = await window.myAPI.setPackagePaths({ package1Path, package2Path });
        console.log(result);

        const result1Div = document.getElementById('result1') as HTMLDivElement;
        const result2Div = document.getElementById('result2') as HTMLDivElement;
        const middleButtonContainer = document.getElementById('middleButtonContainer') as HTMLDivElement;

        result1Div.innerHTML = `<ul>${package1Files.map(file => `<li>${file.name}</li>`).join('')}</ul>`;
        result2Div.innerHTML = `<ul>${package2Files.map(file => `<li>${file.name}</li>`).join('')}</ul>`;

        middleButtonContainer.innerHTML = '';

        const { localUpdated, remoteUpdated } = comparePackages(package1Files, package2Files);

        createButton(`Local Updated: ${localUpdated.length}`, middleButtonContainer, 'localUpdated', localUpdated);
        createButton(`Remote Updated: ${remoteUpdated.length}`, middleButtonContainer, 'remoteUpdated', remoteUpdated);
    } catch (error) {
        console.error('Failed to handle package comparison:', error);
    }
}

// Function to read files from a directory
async function readFilesFromDirectory(directoryPath: string): Promise<File[]> {
    try {
        const fileData: FileData[] = await window.myAPI.readFilesFromDirectory(directoryPath);

        return fileData.map((file: FileData) => {
            const fileBlob = new Blob([file.path], { type: 'text/plain' });
            return new File([fileBlob], file.name, { lastModified: file.lastModified });
        });
    } catch (error) {
        console.error('Failed to read files from directory:', error);
        return [];
    }
}

function createButton(label: string, container: HTMLElement, type: string, fileList: File[]): void {
    const button: HTMLButtonElement = document.createElement('button');
    button.textContent = label;

    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        const queryString = new URLSearchParams({
            type,
            files: JSON.stringify(fileList.map(file => file.name))
        }).toString();

        // Adjust path as necessary
        const url = `../html/selection.html?${queryString}`;
        console.log('Navigating to:', url); // Debug line to check URL

        // Navigate to the selection page
        window.location.assign(url);
    });

    container.appendChild(button);
}



// Function to compare files in two packages
function comparePackages(locals: File[], remotes: File[]): { localUpdated: File[], remoteUpdated: File[] } {
    const localUpdated: File[] = [];
    const remoteUpdated: File[] = [];

    const processedLocals: Set<string> = new Set();
    const processedRemotes: Set<string> = new Set();

    for (const localFile of locals) {
        const remoteFile = remotes.find(file => file.name === localFile.name);
        if (remoteFile) {
            if (localFile.lastModified > remoteFile.lastModified) {
                localUpdated.push(localFile);
            } else if (localFile.lastModified < remoteFile.lastModified) {
                remoteUpdated.push(remoteFile);
            }
            processedLocals.add(localFile.name);
            processedRemotes.add(remoteFile.name);
        } else {
            localUpdated.push(localFile);
            processedLocals.add(localFile.name);
        }
    }

    for (const remoteFile of remotes) {
        if (!processedRemotes.has(remoteFile.name)) {
            remoteUpdated.push(remoteFile);
        }
    }

    return { localUpdated, remoteUpdated };
}

// Add event listeners to buttons
document.getElementById('openDialog1')?.addEventListener('click', () => openDirectoryDialogForPackage('Package1'));
document.getElementById('openDialog2')?.addEventListener('click', () => openDirectoryDialogForPackage('Package2'));
document.getElementById('compareButton')?.addEventListener('click', handlePackageComparison);
