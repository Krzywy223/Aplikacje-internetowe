// Initialize the map and marker
let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

// Define rows, cols, and variables to track correct pieces
let rows = 4;
let cols = 4;
let correctPieces = 0;
const totalPieces = rows * cols;

let puzzleContainer; // Declare puzzleContainer in a scope accessible to all functions

// Event listener for the 'Save' button
document.getElementById("saveButton").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error(err);
            return;
        }
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        let width = 600;
        let height = 300;

        let puzzleWidth = width / cols;
        let puzzleHeight = height / rows;
        let pieces = [];

        // Create the puzzle container
        puzzleContainer = document.createElement("div");
        puzzleContainer.id = "puzzleContainer";
        puzzleContainer.style.position = "relative";
        puzzleContainer.style.width = width + "px";
        puzzleContainer.style.height = height + "px";
        puzzleContainer.style.border = "1px solid black";
        document.body.appendChild(puzzleContainer);

        // Create and slice puzzle pieces
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let piece = document.createElement("canvas");
                piece.id = `piece-${counter}`; // Assign unique ID to each piece
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

        // Shuffle the pieces
        pieces = pieces.sort(() => Math.random() - 0.5);

        // Place the shuffled pieces into the puzzle container
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let piece = pieces.pop();
                piece.style.left = x * puzzleWidth + "px";
                piece.style.top = y * puzzleHeight + "px";
                puzzleContainer.appendChild(piece);
            }
        }

        // Create the puzzle solving area
        let solvePuzzle = document.getElementById("puzzleMap");
        solvePuzzle.style.position = "relative";
        solvePuzzle.style.width = width + "px";
        solvePuzzle.style.height = height + "px";
        solvePuzzle.style.border = "1px solid black";

        // Create drop zones for the puzzle pieces
        counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let place = document.createElement("div");
                place.id = `place-${counter}`; // Assign unique ID to each place
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

// Drag start event handler
function dragStart(event) {
    event.dataTransfer.setData('piece', event.target.id);
}

// Drag over event handler
function dragOver(event) {
    event.preventDefault(); // Allow dropping
}

// Drop event handler with swapping functionality
function dropPiece(event) {
    event.preventDefault();

    const pieceId = event.dataTransfer.getData('piece');
    const draggedPiece = document.getElementById(pieceId);

    const fromParent = draggedPiece.parentNode;
    const toDropZone = this;

    // Remove the dragged piece from its current parent
    if (fromParent) {
        fromParent.removeChild(draggedPiece);
    }

    // Get the existing piece in the drop zone (if any)
    const existingPiece = toDropZone.firstChild;

    // Append the dragged piece to the drop zone
    toDropZone.appendChild(draggedPiece);

    // Reset styles of the dragged piece
    draggedPiece.removeAttribute('style');
    draggedPiece.style.width = '100%';
    draggedPiece.style.height = '100%';
    draggedPiece.style.position = 'relative';
    draggedPiece.style.left = '0';
    draggedPiece.style.top = '0';

    // Update correctPieces count for the dragged piece
    if (draggedPiece.dataset.piece === toDropZone.dataset.requiredPiece) {
        correctPieces++;
    } else {
        // If it was previously correctly placed, decrement correctPieces
        if (fromParent.dataset && fromParent.dataset.requiredPiece && draggedPiece.dataset.piece === fromParent.dataset.requiredPiece) {
            correctPieces--;
        }
    }

    // Handle swapping if there was an existing piece
    if (existingPiece) {
        // Remove existing piece from the drop zone
        toDropZone.removeChild(existingPiece);

        // Append the existing piece to the previous parent of the dragged piece
        fromParent.appendChild(existingPiece);

        // Reset styles of the existing piece
        existingPiece.removeAttribute('style');

        if (fromParent.id === 'puzzleContainer') {
            // Position the existing piece in the puzzle container
            existingPiece.style.position = 'absolute';
            existingPiece.style.left = draggedPiece.style.left;
            existingPiece.style.top = draggedPiece.style.top;
            existingPiece.style.border = "1px solid black";
        } else {
            // Position the existing piece within another drop zone
            existingPiece.style.width = '100%';
            existingPiece.style.height = '100%';
            existingPiece.style.position = 'relative';
            existingPiece.style.left = '0';
            existingPiece.style.top = '0';
        }

        // Update correctPieces count for the existing piece
        if (existingPiece.dataset.piece === fromParent.dataset.requiredPiece) {
            correctPieces++;
        } else {
            if (existingPiece.dataset.piece === toDropZone.dataset.requiredPiece) {
                correctPieces--;
            }
        }
    } else {
        // If moving from a drop zone to an empty drop zone
        if (fromParent.id !== 'puzzleContainer' && fromParent.dataset.requiredPiece) {
            if (draggedPiece.dataset.piece === fromParent.dataset.requiredPiece) {
                correctPieces--;
            }
        }
    }

    // Check if all pieces are correctly placed
    if (correctPieces === totalPieces) {
        alert('Gratulacje! Ułożyłeś wszystkie klocki prawidłowo!');
    }
}

// Event listener for the 'Get Location' button
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
