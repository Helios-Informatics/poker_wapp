// display slider value
document.addEventListener('DOMContentLoaded', function () {
    var slider = document.getElementById('customRange3');
    var output = document.getElementById('sliderValue');

    output.innerText = "$ " + slider.value;

    slider.addEventListener('input', function () {
        output.innerText = "$ " + slider.value;
    });


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

    document.getElementById('checkButton').addEventListener('click', function () {
        window.location.href = 'http://localhost:9000/check';
    });

});