document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('excel');
    const selectedFileDiv = document.getElementById('selectedFile');
    const popup = document.getElementById('popup');

    fileInput.addEventListener('change', function() {
        const fileName = fileInput.files[0].name;
        selectedFileDiv.textContent = `Selected File: ${fileName}`;
    });

    //const form = document.querySelector('form');


});
