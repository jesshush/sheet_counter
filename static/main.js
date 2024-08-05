// Function to handle file selection and preview
function handleFile(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const fileType = file.type;
            if (fileType.startsWith('image/')) {
                document.getElementById('imageArea').style.display = 'block';
                document.getElementById('videoArea').style.display = 'none';
                document.getElementById('imageResult').src = e.target.result;
                document.getElementById('imageResult').alt = file.name;
                document.getElementById('predictSheetsBtn').style.display = 'block';
                document.getElementById('processVideoBtn').style.display = 'none';
            } else if (fileType.startsWith('video/')) {
                document.getElementById('videoArea').style.display = 'block';
                document.getElementById('imageArea').style.display = 'none';
                document.getElementById('videoResult').src = e.target.result;
                document.getElementById('videoResult').alt = file.name;
                document.getElementById('predictSheetsBtn').style.display = 'none';
                document.getElementById('processVideoBtn').style.display = 'block';
            } else {
                document.getElementById('imageArea').style.display = 'none';
                document.getElementById('videoArea').style.display = 'none';
                alert('Unsupported file type.');
            }
        };
        reader.readAsDataURL(file);
    }
}

function predictSheets() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/predict_image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Estimated sheet count:', data.sheet_count);
        document.getElementById('result-container').innerHTML = `<p class="text-white text-center">Estimated sheet count: ${data.sheet_count}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result-container').innerHTML = `<p class="text-white text-center">Error: ${error}</p>`;
    });
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('upload').addEventListener('change', function() {
        handleFile(this);
    });
    
    document.getElementById('upload').addEventListener('change', showFileName);

    document.getElementById('predictSheetsBtn').addEventListener('click', predictSheets);
});

// Function to display selected file name
function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    document.getElementById('upload-label').textContent = fileName;
}
