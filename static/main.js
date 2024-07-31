document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const dropZone = document.querySelector('.drop-zone');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    function showPreview(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    }

    dropZone.addEventListener('click', () => imageInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drop-zone--over');
    });

    ['dragleave', 'dragend'].forEach(type => {
        dropZone.addEventListener(type, () => {
            dropZone.classList.remove('drop-zone--over');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drop-zone--over');
        
        if (e.dataTransfer.files.length) {
            imageInput.files = e.dataTransfer.files;
            showPreview(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        showPreview(e.target.files[0]);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        loading.style.display = 'block';
        result.textContent = '';

        try {
            const response = await fetch('/api/count-objects', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Server error');
            }

            const data = await response.json();
            result.innerHTML = `<i class="fas fa-check-circle"></i> Number of objects detected: <strong>${data.count}</strong>`;
        } catch (error) {
            console.error('Error:', error);
            result.innerHTML = '<i class="fas fa-exclamation-triangle"></i> An error occurred while processing the image.';
        } finally {
            loading.style.display = 'none';
        }
    });
});