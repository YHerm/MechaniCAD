function isNewer(file1: File, file2: File): boolean {
    return file2.lastModified > file1.lastModified;
}

function formatFileTimestamp(file: File): string {
    const timestamp = new Date(file.lastModified);
    return timestamp.toLocaleString();
}

function prefixTimestamp(file: File): string {
    return `${file.name} last modified at: ${formatFileTimestamp(file)}`;
}

function isExist(file: File | undefined): boolean {
    return file ? true : false;
}

function handleFileComparison(fileInput1: HTMLInputElement, fileInput2: HTMLInputElement, textBlock: HTMLDivElement) {
    const file1 = fileInput1.files?.[0];
    const file2 = fileInput2.files?.[0];
    textBlock.innerHTML = '';

    textBlock.innerHTML += `<p>${isExist(file1) ?  prefixTimestamp(file1!) : "No File1 selected."}</p>`;
    textBlock.innerHTML += `<p>${isExist(file2) ?  prefixTimestamp(file2!) : "No File2 selected."}</p>`;

    if (isExist(file1) && isExist(file2)){
        const newerFile = isNewer(file1!, file2!) ? file2 : file1;
        textBlock.innerHTML += `<p>${newerFile?.name} is more recent.</p>`;
    }
}

document.getElementById('button')?.addEventListener('click',
    () => handleFileComparison(
        document.getElementById('File1') as HTMLInputElement,
        document.getElementById('File2') as HTMLInputElement,
        document.getElementById('result') as HTMLDivElement
    )
);