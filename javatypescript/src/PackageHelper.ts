function isEmpty(files: FileList | null): boolean {
    return !files || files.length === 0;
}

function getContent(files: FileList): string {
    const fileList = Array.from(files!).map(file => file.webkitRelativePath || file.name);
    return `<ul>${fileList.map(file => `<li>${file}</li>`).join('')}</ul>`;
}

function getDirectoryName(files: FileList): string {
    const firstFile = files[0];
    const fullPath = firstFile.webkitRelativePath || firstFile.name;
    const pathParts = fullPath.split('/');
    return pathParts.length > 1 ? pathParts[0] : 'Unknown Directory';
}

function getTitledContent(directory: HTMLInputElement): string {
    if(isEmpty(directory.files)){
        return 'Empty Package'
    }
    const files: FileList = directory.files!;
    return `<p>${getDirectoryName(files)} Package:</p>${getContent(files)}`
}

function handleDirectoryComparison() {
    const directory = document.getElementById('Package') as HTMLInputElement;

    const resultDiv = document.getElementById('result') as HTMLDivElement;
    resultDiv.innerHTML = '';

    resultDiv.innerHTML += getTitledContent(directory);
}

document.getElementById('button')?.addEventListener('click', handleDirectoryComparison);