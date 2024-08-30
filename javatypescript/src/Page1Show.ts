import { showDirectory } from './PackageHelper.js';

document.getElementById('button')?.addEventListener('click', 
    () => showDirectory(
        document.getElementById('Package1') as HTMLInputElement,
        document.getElementById('result1') as HTMLDivElement
    )
);
document.getElementById('button')?.addEventListener('click', 
    () => showDirectory(
        document.getElementById('Package2') as HTMLInputElement,
        document.getElementById('result2') as HTMLDivElement
    )
);