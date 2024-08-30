
function handlePackageComparison() {
    const package1Input = document.getElementById('Package1') as HTMLInputElement;
    const package2Input = document.getElementById('Package2') as HTMLInputElement;
    const result1Div = document.getElementById('result1') as HTMLDivElement;
    const result2Div = document.getElementById('result2') as HTMLDivElement;
    const middleButtonContainer = document.getElementById('middleButtonContainer') as HTMLDivElement;

    const package1Files = Array.from(package1Input.files || []);
    const package2Files = Array.from(package2Input.files || []);

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
}

function createButton(label: string, container: HTMLElement) {
    const button = document.createElement('button');
    button.textContent = label;
    container.appendChild(button);
}

document.getElementById('button')?.addEventListener('click', handlePackageComparison);