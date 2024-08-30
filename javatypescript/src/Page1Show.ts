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

    if (package1Files.length > package2Files.length) {
        createButton('p1', middleButtonContainer);
    } else if (package2Files.length > package1Files.length) {
        createButton('p2', middleButtonContainer);
    } else {
        middleButtonContainer.innerHTML = '<p>Both packages have the same number of files.</p>';
    }

    comparePackages(package1Files, package2Files)
}

function createButton(label: string, container: HTMLElement): void {
    const button: HTMLButtonElement = document.createElement('button');
    button.textContent = label;
    container.appendChild(button);
}

function comparePackages(locals: File[], remotes: File[]): void {
    const localUpdated: File[] = [];
    const remoteUpdated: File[] = [];

    const processedLocals: Set<File> = new Set();
    const processedRemotes: Set<File> = new Set();

    for (const localFile of locals) {
        console.log(`Local File: ${localFile.name}, Size: ${localFile.size} bytes`);

        const remoteFile = remotes.find(file => file.name === localFile.name);
        if (remoteFile) {
            if (localFile.lastModified > remoteFile.lastModified) {
                localUpdated.push(localFile);
            } else if (localFile.lastModified < remoteFile.lastModified) {
                remoteUpdated.push(remoteFile);
            }
            processedLocals.add(localFile);
            processedRemotes.add(remoteFile);
        } else {
            localUpdated.push(localFile);
            processedLocals.add(localFile);
        }
    }

    remotes.filter(file => !processedRemotes.has(file));
    for (const remoteFile of remotes) {
        console.log(`Remote File: ${remoteFile.name}, Size: ${remoteFile.size} bytes`);
        remoteUpdated.push(remoteFile);
    }

    console.log(`Remote: ${remoteUpdated.length}`);
    console.log(`Local: ${localUpdated.length}`);
}

document.getElementById('button')?.addEventListener('click', handlePackageComparison);
