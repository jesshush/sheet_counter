
const URL = "https://teachablemachine.withgoogle.com/models/xvJD7urTu/";
const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

let model, labelContainer, maxPredictions;

async function init() {
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function predictNow(input) {
    try {
        const prediction = await model.predict(input);
        for (let i = 0; i < maxPredictions; i++) {
            const probability = prediction[i].probability.toFixed(2) * 100;
            const progress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ' + probability + '%" aria-valuenow="' + probability + '" aria-valuemin="0" aria-valuemax="100">' + probability + '%</div></div>';
            const classPrediction = prediction[i].className + progress;
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
    } catch (error) {
        console.error('Error predicting file:', error);
    }
}

function handleFile(input) {
    if (input.files && input.files[0]) {
        var file = input.files[0];
        var reader = new FileReader();
        
        reader.onload = function(e) {
            var fileType = file.type;
            if (fileType.startsWith('image/')) {
                $('#imageArea').show();
                $('#videoArea').hide();
                $('#imageResult').attr('src', e.target.result);
                $('#imageResult').attr('alt', file.name);
                predictNow($('#imageResult')[0]);
            } else if (fileType.startsWith('video/')) {
                $('#videoArea').show();
                $('#imageArea').hide();
                $('#videoResult').attr('src', e.target.result);
                $('#videoResult').attr('alt', file.name);
            } else {
                $('#imageArea').hide();
                $('#videoArea').hide();
                alert('Unsupported file type.');
            }
        };
        reader.readAsDataURL(file);
    }
}

function countSheets() {
    alert("Count Sheets functionality not implemented yet.");
}

$(function() {
    $('#upload').on('change', function() {
        handleFile(this);
    });
});

var input = document.getElementById('upload');
var infoArea = document.getElementById('upload-label');

input.addEventListener('change', showFileName);

function showFileName(event) {
    var input = event.srcElement;
    var fileName = input.files[0].name;
    infoArea.textContent = 'File name: ' + fileName;
}
