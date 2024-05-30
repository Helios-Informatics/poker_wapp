// display slider value
document.addEventListener('DOMContentLoaded', function () {
    var slider = document.getElementById('customRange3');
    var output = document.getElementById('sliderValue');

    output.innerText = "$ " + slider.value;

    slider.addEventListener('input', function () {
        output.innerText = "$ " + slider.value;
    });


    let progressBar = document.querySelector('.progress-bar');
    let width = 100;
    let interval = setInterval(function () {
        if (width <= 0) {
            clearInterval(interval);
            if (document.getElementById('checkButton') !== null) {
                document.getElementById('checkButton').click();
            } else {
                document.getElementById('foldButton').click();
            }
        } else {
            width--;
            progressBar.style.width = width + '%';
        }
    }, 100); // 100ms * 100 steps = 10 seconds

    //call functions on button clicks
    document.getElementById('callButton').addEventListener('click', function () {
        window.location.href = 'http://localhost:9000/call';
    });

    document.getElementById('foldButton').addEventListener('click', function () {
        window.location.href = 'http://localhost:9000/fold';
    });

    document.getElementById('raiseButton').addEventListener('click', function () {
        var amount = document.getElementById('customRange3').value
        window.location.href = 'http://localhost:9000/bet/' + amount;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('checkButton').addEventListener('click', function () {
        window.location.href = 'http://localhost:9000/check';
    });
});