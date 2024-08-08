function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', 0.7);
            };
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function handleFile(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const resultContainer = document.getElementById('result-container');
            resultContainer.innerHTML = '';
            if (file.type.startsWith('image/')) {
                const img = document.getElementById('imageResult');
                img.src = e.target.result;
                document.getElementById('imageArea').style.display = 'block';
                document.getElementById('videoArea').style.display = 'none';
                document.getElementById('predictSheetsBtn').style.display = 'inline-block';
                document.getElementById('processVideoBtn').style.display = 'none';
            } else if (file.type.startsWith('video/')) {
                const video = document.getElementById('videoResult');
                video.src = e.target.result;
                document.getElementById('videoArea').style.display = 'block';
                document.getElementById('imageArea').style.display = 'none';
                document.getElementById('predictSheetsBtn').style.display = 'none';
                document.getElementById('processVideoBtn').style.display = 'inline-block';
            }
        }
        reader.readAsDataURL(file);
    }
}

async function predictSheets() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    
    // Resize image before sending to server
    const resizedFile = await resizeImage(file, 800, 600);
    
    const formData = new FormData();
    formData.append('file', resizedFile);
    
    fetch('/predict-sheets', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = `<p class="text-white">Estimated number of cardboard sheets: ${data.prediction}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function processVideo() {
    const fileInput = document.getElementById('upload');
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    fetch('/process-video', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const resultContainer = document.getElementById('result-container');
        resultContainer.innerHTML = `<p class="text-white">Result: ${data.result}</p>`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}