import { getTitledContent } from './PackageHelper.js';
import { getFileArray } from './PackageHelper.js';

function handleFileComparison() {
    const package1Input = document.getElementById('Package1') as HTMLInputElement;
    const package2Input = document.getElementById('Package2') as HTMLInputElement;
    const resultDiv1 = document.getElementById('result1') as HTMLDivElement;
    const resultDiv2 = document.getElementById('result2') as HTMLDivElement;

    resultDiv1.innerHTML = getTitledContent(package1Input);
    resultDiv2.innerHTML = getTitledContent(package2Input);

    const package1Files = getFileArray(package1Input.files);
    const package2Files = getFileArray(package2Input.files);

    const buttonDiv = document.createElement('div');
    const button = document.createElement('button');

    if (package1Files.length > package2Files.length) {
        button.textContent = 'p1';
    } else if (package2Files.length > package1Files.length) {
        button.textContent = 'p2';
    } else {
        button.textContent = 'Equal';
    }

    buttonDiv.appendChild(button);
    resultDiv1.appendChild(buttonDiv);
}

document.getElementById('button')?.addEventListener('click', handleFileComparison);