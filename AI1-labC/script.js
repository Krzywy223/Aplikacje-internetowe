let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

let rows = 4;
let cols = 4;
let correctPieces = 0;
const totalPieces = rows * cols;

let puzzleContainer;

document.getElementById("saveButton").addEventListener("click", function () {
    const saveButton = this;

    saveButton.disabled = true;

    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error(err);

            saveButton.disabled = false;
            saveButton.textContent = "Save Raster Map";
            return;
        }

        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        rasterMap.style.display = "block";

        let width = 600;
        let height = 300;

        let puzzleWidth = width / cols;
        let puzzleHeight = height / rows;
        let pieces = [];

        puzzleContainer = document.createElement("div");
        puzzleContainer.id = "puzzleContainer";
        puzzleContainer.style.position = "relative";
        puzzleContainer.style.width = width + "px";
        puzzleContainer.style.height = height + "px";
        document.body.appendChild(puzzleContainer);

        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let piece = document.createElement("canvas");
                piece.id = `piece-${counter}`;
                piece.width = puzzleWidth;
                piece.height = puzzleHeight;
                piece.style.border = "1px solid black";
                piece.style.position = "absolute";
                piece.draggable = true;
                piece.dataset.piece = counter;
                piece.addEventListener("dragstart", dragStart);
                let pieceContext = piece.getContext("2d");
                pieceContext.drawImage(
                    rasterMap,
                    x * puzzleWidth,
                    y * puzzleHeight,
                    puzzleWidth,
                    puzzleHeight,
                    0,
                    0,
                    puzzleWidth,
                    puzzleHeight
                );
                pieces.push(piece);
                counter++;
            }
        }

        pieces = pieces.sort(() => Math.random() - 0.5);

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let piece = pieces.pop();
                piece.style.left = x * puzzleWidth + "px";
                piece.style.top = y * puzzleHeight + "px";
                puzzleContainer.appendChild(piece);
            }
        }

        let solvePuzzle = document.getElementById("puzzleMap");
        solvePuzzle.style.position = "relative";
        solvePuzzle.style.width = width + "px";
        solvePuzzle.style.height = height + "px";
        solvePuzzle.style.border = "1px solid black";

        counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let place = document.createElement("div");
                place.id = `place-${counter}`;
                place.style.width = puzzleWidth + "px";
                place.style.height = puzzleHeight + "px";
                place.style.border = "1px solid black";
                place.style.position = "absolute";
                place.style.left = x * puzzleWidth + "px";
                place.style.top = y * puzzleHeight + "px";
                place.dataset.requiredPiece = counter;
                place.addEventListener("dragover", dragOver);
                place.addEventListener("drop", dropPiece);
                solvePuzzle.appendChild(place);
                counter++;
            }
        }
    });
});


function dragStart(event) {
    event.dataTransfer.setData('piece', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function showCompletionNotification() {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', {
                body: 'Ułożyłeś wszystkie klocki prawidłowo! 🎉',
            });
        } else if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log(`Notification permission: ${permission}`);
                if (permission === 'granted') {
                    new Notification('Gratulacje!', {
                        body: 'Ułożyłeś wszystkie klocki prawidłowo! 🎉'
                    });
                    console.log('Ułożyłeś wszystkie klocki prawidłowo!');
                } else if (permission === 'denied') {
                    console.warn('User denied notifications.');
                    alert('Gratulacje! Ułożyłeś wszystkie klocki prawidłowo! 🎉');
                }
            }).catch(err => {
                console.error('Notification permission request error:', err);
            });
        } else {
            console.warn('Notifications denied previously.');
            alert('Gratulacje! Ułożyłeś wszystkie klocki prawidłowo! 🎉');
        }
    } else {
        console.error('Notifications are not supported in this browser.');
        alert('Gratulacje! Ułożyłeś wszystkie klocki prawidłowo! 🎉');
    }
}


function checkPuzzleCompletion() {
    if (correctPieces === totalPieces) {
        setTimeout(() => {
            showCompletionNotification();
        }, 100);
    }
}

function dropPiece(event) {
    event.preventDefault();

    const pieceId = event.dataTransfer.getData('piece');
    const draggedPiece = document.getElementById(pieceId);

    const fromParent = draggedPiece.parentNode;
    const toDropZone = this;

    if (fromParent) {
        fromParent.removeChild(draggedPiece);
    }

    const existingPiece = toDropZone.firstChild;

    toDropZone.appendChild(draggedPiece);

    draggedPiece.removeAttribute('style');
    draggedPiece.style.width = '100%';
    draggedPiece.style.height = '100%';
    draggedPiece.style.position = 'relative';
    draggedPiece.style.left = '0';
    draggedPiece.style.top = '0';

    if (draggedPiece.dataset.piece === toDropZone.dataset.requiredPiece) {
        correctPieces++;
    } else {
        if (fromParent.dataset && fromParent.dataset.requiredPiece && draggedPiece.dataset.piece === fromParent.dataset.requiredPiece) {
            correctPieces--;
        }
    }

    if (existingPiece) {
        toDropZone.removeChild(existingPiece);
        fromParent.appendChild(existingPiece);
        existingPiece.removeAttribute('style');

        if (fromParent.id === 'puzzleContainer') {
            existingPiece.style.position = 'absolute';
            existingPiece.style.left = draggedPiece.style.left;
            existingPiece.style.top = draggedPiece.style.top;
            existingPiece.style.border = "1px solid black";
        } else {
            existingPiece.style.width = '100%';
            existingPiece.style.height = '100%';
            existingPiece.style.position = 'relative';
            existingPiece.style.left = '0';
            existingPiece.style.top = '0';
        }

        if (existingPiece.dataset.piece === fromParent.dataset.requiredPiece) {
            correctPieces++;
        } else {
            if (existingPiece.dataset.piece === toDropZone.dataset.requiredPiece) {
                correctPieces--;
            }
        }
    } else {
        if (fromParent.id !== 'puzzleContainer' && fromParent.dataset.requiredPiece) {
            if (draggedPiece.dataset.piece === fromParent.dataset.requiredPiece) {
                correctPieces--;
            }
        }
    }

    checkPuzzleCompletion();
}

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});