document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
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
            result.textContent = `Number of objects detected: ${data.count}`;
        } catch (error) {
            console.error('Error:', error);
            result.textContent = 'An error occurred while processing the image.';
        } finally {
            loading.style.display = 'none';
        }
    });
});