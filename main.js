const mapTable = document.querySelector("#mapTable");
const clickMenu = document.querySelector("#clickMenu");
const gridSize = 13;
const progressColors = ["rgba(0, 0, 0, 0)", "green", "orange", "red"];

let map = [];
let roomTypes = [
    "normal",
    "boss",
    "mini-boss",
    "treasure",
    "planetarium",
    "shop",
    "curse",
    "sacrifice",
    "library",
    "arcade",
    "challenge",
    "boss-challenge",
    "vault",
    "dice",
    "bedroom",
    "black-market",
    "secret",
    "super-secret",
    "ultra-secret",
    "error",
];
let currentRoomType = "normal";
let draggedCells = [];
let lastHoveredTd = [0, 0];

function createTdElement(mapObj, row, column) {
    const td = document.createElement("td");
    td.setAttribute("--data-coords-x", row);
    td.setAttribute("--data-coords-y", column);

    if (mapObj.type == "") {
        td.classList.add("roomEmptyTd");
    } else if (mapObj.type == "normal") {
        td.classList.add("roomTd");
    } else {
        td.classList.add("roomTd");

        let img = document.createElement("img");
        img.setAttribute("draggable", "false");
        img.setAttribute("src", `./imgs/${mapObj.type}.webp`);
        img.classList.add("imgTd");
        td.appendChild(img);
    }

    let progressDiv = document.createElement("div");
    progressDiv.classList.add("progressEl");
    progressDiv.style.backgroundColor = progressColors[mapObj.progress];
    td.appendChild(progressDiv);

    td.addEventListener("mouseover", (event) => {
        lastHoveredTd = [row, column];

        if (event.buttons == 1) {
            dragCells(td, row, column);
        } else if (event.buttons == 2) {
            handleClick(row, column, event.buttons);
        }
    });

    td.addEventListener("mousedown", (event) => {
        if (draggedCells.length == 0 && event.button == 0) {
            handleDragCells();
        } else if (event.button == 2) {
            handleClick(row, column, event.button);
        }
    });

    td.addEventListener("mouseup", (event) => {
        if (draggedCells.length > 1 && event.button == 0) {
            handleDragCells();
        } else {
            handleClick(row, column, event.button);
        }
    });

    td.addEventListener("contextmenu", (event) => {
        handleClick(row, column, event);
        event.preventDefault();
    });

    if (mapObj.borders[0] == 0) {
        td.style.borderTop = "0px solid black";
    }
    if (mapObj.borders[1] == 0) {
        td.style.borderLeft = "0px solid black";
    }
    if (mapObj.borders[2] == 0) {
        td.style.borderBottom = "0px solid black";
    }
    if (mapObj.borders[3] == 0) {
        td.style.borderRight = "0px solid black";
    }

    return td;
}

function createTable(rows, columns) {
    map = [];
    mapTable.innerHTMl = "";

    for (let i = 0; i < rows; i++) {
        let rowArray = [];
        const tr = document.createElement("tr");

        for (let j = 0; j < columns; j++) {
            if (i == 6 && j == 6) {
                let tdInfo = {
                    type: "normal",
                    borders: [1, 1, 1, 1],
                    progress: 0,
                };

                rowArray.push(tdInfo);
                let td = createTdElement(tdInfo, i, j);
                tr.appendChild(td);
            } else {
                let tdInfo = {
                    type: "",
                    borders: [1, 1, 1, 1],
                    progress: 0,
                };

                rowArray.push(tdInfo);
                let td = createTdElement(tdInfo, i, j);
                tr.appendChild(td);
            }
        }

        mapTable.appendChild(tr);
        map.push(rowArray);
    }
}

function updateWholeTable() {
    mapTable.innerHTML = "";

    for (let i = 0; i < map.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < map[i].length; j++) {
            const td = createTdElement(map[i][j], i, j);

            tr.appendChild(td);
        }
        mapTable.appendChild(tr);
    }
}

function handleClick(x, y, button) {
    // event.button == 0 - left
    // event.button == 1 - scroll
    // event.button == 2 - right

    if (button == null || button == 0) {
        map[x][y].type = currentRoomType;
        map[x][y].borders = [1, 1, 1, 1];
    } else if (button == 2) {
        map[x][y].type = "";
        map[x][y].borders = [1, 1, 1, 1];
        map[x][y].progress = 0;
    }

    updateWholeTable();
    draggedCells = [];
}

function dragCells(element, row, column) {
    element.classList.add("roomDraggedTd");

    draggedCells.push({
        element,
        row,
        column,
    });
}

function handleDragCells() {
    let draggedCellsCords = [];
    for (let i = 0; i < draggedCells.length; i++) {
        const element = draggedCells[i].element;
        const row = draggedCells[i].row;
        const column = draggedCells[i].column;

        let isUnique = true;
        draggedCellsCords.forEach((el) => {
            if (el.row == row && el.column == column) {
                isUnique = false;
            }
        });

        if (isUnique) {
            draggedCellsCords.push({ row, column });
        }

        element.classList.remove("roomDraggedTd");
    }

    for (let i = 0; i < draggedCells.length; i++) {
        const row = draggedCells[i].row;
        const column = draggedCells[i].column;

        map[row][column].type = currentRoomType;
        map[row][column].borders = [1, 1, 1, 1];
        map[row][column].progress = 0;

        draggedCellsCords.forEach((el) => {
            // cell o 1 u góry
            if (column == el.column && row > 0 && row - 1 == el.row) {
                map[row][column].borders[0] = 0;
            }
            // cell o 1 w prawo
            if (row == el.row && column < gridSize - 1 && column + 1 == el.column) {
                map[row][column].borders[3] = 0;
            }
            // cell o 1 w dół
            if (column == el.column && row < gridSize - 1 && row + 1 == el.row) {
                map[row][column].borders[2] = 0;
            }
            // cell o 1 w lewo
            if (row == el.row && column > 0 && column - 1 == el.column) {
                map[row][column].borders[1] = 0;
            }
        });
    }

    updateWholeTable();
    draggedCells = [];
}

function changeProgress(row, column) {
    map[row][column].progress = (map[row][column].progress + 1) % progressColors.length;
    console.log(map[row][column].progress);
    updateWholeTable();
}

document.body.addEventListener("keyup", (event) => {
    if (event.key == "p") {
        changeProgress(...lastHoveredTd);
    }
});

function createMenu() {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("roomTypeRow");

    for (let i = 0; i < roomTypes.length; i++) {
        const roomType = roomTypes[i];

        const div = document.createElement("div");
        div.classList.add("roomTypeButton");
        div.addEventListener("click", () => {
            currentRoomType = roomType;
        });

        if (roomType == "normal") {
            div.innerText = "NORMAL ROOM";
        } else {
            const img = document.createElement("img");
            img.setAttribute("draggable", "false");
            img.setAttribute("src", `./imgs/${roomTypes[i]}.webp`);

            div.appendChild(img);
        }

        if (i % 2 == 0) {
            rowDiv.appendChild(div);
        } else {
            rowDiv.appendChild(div);
            clickMenu.appendChild(rowDiv);

            rowDiv = document.createElement("div");
            rowDiv.classList.add("roomTypeRow");
        }
    }
}

function moveWholeTable(direction) {
    if (direction == "ArrowUp") {
        map.shift();
        let rowArray = [];

        for (let i = 0; i < gridSize; i++) {
            let tdInfo = {
                type: "",
                borders: [1, 1, 1, 1],
                progress: 0,
            };

            rowArray.push(tdInfo);
        }

        map.push(rowArray);
    } else if (direction == "ArrowDown") {
        map.pop();
        let rowArray = [];

        for (let i = 0; i < gridSize; i++) {
            let tdInfo = {
                type: "",
                borders: [1, 1, 1, 1],
                progress: 0,
            };

            rowArray.push(tdInfo);
        }

        map.unshift(rowArray);
    } else if (direction == "ArrowRight") {
        map.forEach((el) => {
            el.pop();

            let tdInfo = {
                type: "",
                borders: [1, 1, 1, 1],
                progress: 0,
            };

            el.unshift(tdInfo);
        });
    } else if (direction == "ArrowLeft") {
        map.forEach((el) => {
            el.shift();

            let tdInfo = {
                type: "",
                borders: [1, 1, 1, 1],
                progress: 0,
            };

            el.push(tdInfo);
        });
    }

    updateWholeTable();
}

document.body.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(event.key)) {
        event.preventDefault();
        moveWholeTable(event.key);
    }
});

// init
createTable(gridSize, gridSize);
createMenu();
