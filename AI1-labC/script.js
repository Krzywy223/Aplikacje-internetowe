let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
        if (err) {
            console.error(err);
            return;
        }
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");
        rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

        let rows = 4;
        let cols = 4;
        let width = 600;
        let height = 300;

        let puzzleWidth = width / cols;
        let puzzleHeight = height / rows;
        let pieces = [];

        let puzzleContainer = document.createElement("div");
        puzzleContainer.id = "puzzleContainer";
        puzzleContainer.style.position = "relative";
        puzzleContainer.style.width = width + "px";
        puzzleContainer.style.height = height + "px";
        document.body.appendChild(puzzleContainer);
        let counter = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let piece = document.createElement("canvas");
                piece.id = `${counter++}`;
                piece.width = puzzleWidth;
                piece.height = puzzleHeight;
                piece.style.border = "1px solid black";
                piece.style.position = "absolute";
                piece.draggable = true;
                piece.datapiece = '${counter++}';
                counter++;
                piece.addEventListener("dragstart", dragStart);
                let pieceContext = piece.getContext("2d");
                pieceContext.drawImage(rasterMap, x * puzzleWidth, y * puzzleHeight, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
                pieces.push(piece);
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
                place.id = `${counter++}`;
                place.style.width = puzzleWidth + "px";
                place.style.height = puzzleHeight + "px";
                place.style.border = "1px solid black";
                place.style.position = "absolute";
                place.style.left = x * puzzleWidth + "px";
                place.style.top = y * puzzleHeight + "px";
                counter++;
                place.addEventListener("dragover", dragOver);
                place.addEventListener("drop", dropPiece);
                solvePuzzle.appendChild(place);
            }
        }
    });
});

function dragStart(event) {
    event.dataTransfer.setData('piece', event.target.id);
}

function dragOver(event) {
    event.preventDefault(); // Allow dropping
}

function dropPiece(event) {
    event.preventDefault();

    const pieceId = event.dataTransfer.getData('piece');
    const piece = document.getElementById(pieceId);
    const requiredPiece = this.getAttribute('id'); // Required piece for this place

    // Check if the place has a specific piece requirement
    if (requiredPiece && piece.dataset.piece !== requiredPiece) {
        alert(`This place requires Piece ${requiredPiece}.`);
    } else {
        // Move the piece to the new place
        if (this.firstChild) {
            this.removeChild(this.firstChild); // Remove any existing piece
        }
        this.appendChild(piece); // Append the dragged piece to this place
    }
}

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
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