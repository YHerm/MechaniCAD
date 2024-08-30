function handlePackageComparison(): void {
    const package1Input = document.getElementById('Package1') as HTMLInputElement;
    const package2Input = document.getElementById('Package2') as HTMLInputElement;
    const result1Div = document.getElementById('result1') as HTMLDivElement;
    const result2Div = document.getElementById('result2') as HTMLDivElement;
    const middleButtonContainer = document.getElementById('middleButtonContainer') as HTMLDivElement;

    const package1Files: File[] = Array.from(package1Input.files || []);
    const package2Files: File[] = Array.from(package2Input.files || []);

    result1Div.innerHTML = `<ul>${package1Files.map(file => `<li>${file.name}</li>`).join('')}</ul>`;
    result2Div.innerHTML = `<ul>${package2Files.map(file => `<li>${file.name}</li>`).join('')}</ul>`;

    middleButtonContainer.innerHTML = '';

    // Call comparePackages and get the updated file arrays
    const { localUpdated, remoteUpdated } = comparePackages(package1Files, package2Files);

    // Create buttons for LocalUpdated and RemoteUpdated with file counts and navigation
    createButton(`Local Updated: ${localUpdated.length}`, middleButtonContainer, 'localUpdated', localUpdated);
    createButton(`Remote Updated: ${remoteUpdated.length}`, middleButtonContainer, 'remoteUpdated', remoteUpdated);
}

function createButton(label: string, container: HTMLElement, type: string, fileList: File[]): void {
    const button: HTMLButtonElement = document.createElement('button');
    button.textContent = label;
    button.onclick = () => {
        const queryString = new URLSearchParams({
            type,
            files: JSON.stringify(fileList.map(file => file.name))
        }).toString();
        window.location.href = `selection.html?${queryString}`;
    };
    container.appendChild(button);
}

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

document.getElementById('button')?.addEventListener('click', handlePackageComparison);
