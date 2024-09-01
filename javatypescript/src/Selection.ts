document.addEventListener('DOMContentLoaded', async () => {
    if (!window.myAPI) {
        console.error('myAPI is not exposed in the global window object.');
        return;
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const type = urlParams.get('type') as string;
    const files: string[] = JSON.parse(decodeURIComponent(urlParams.get('files') || '[]'));

    const fileListDiv = document.getElementById('fileList') as HTMLDivElement;
    
    if (files.length === 0) {
        fileListDiv.innerHTML = '<p>No files found.</p>';
        return;
    }

    fileListDiv.innerHTML = files.map(fileName => `
        <div>
            <input type="checkbox" id="${fileName}" />
            <label for="${fileName}">${fileName}</label>
        </div>
    `).join('');

    document.getElementById('submitSelection')?.addEventListener('click', async () => {
        const selectedFiles: string[] = files.filter(fileName => 
            (document.getElementById(fileName) as HTMLInputElement).checked
        );

        try {
            const result = await window.myAPI.copyFiles({ files: selectedFiles, type });
            if (result.success) {
                alert('Files copied successfully.');
            } else {
                alert('Error copying files: ' + result.error);
            }
        } catch (error) {
            console.error('Error during IPC communication:', error);
        }
    });
});
