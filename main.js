const mapTable = document.querySelector("#mapTable");
const clickMenu = document.querySelector("#clickMenu");

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

function createTdElement(roomType, row, column) {
    const td = document.createElement("td");
    td.setAttribute("--data-coords-x", row);
    td.setAttribute("--data-coords-y", column);

    if (roomType == "") {
        td.classList.add("roomEmptyTd");
    } else if (roomType == "normal") {
        td.classList.add("roomTd");
    } else {
        td.classList.add("roomTd");

        let img = document.createElement("img");
        img.setAttribute("draggable", "false");
        img.setAttribute("src", roomType);
        img.classList.add("imgTd");
        td.appendChild(img);
    }

    td.addEventListener("mouseup", (event) => {
        handleClick(row, column, event);
    });

    td.addEventListener("contextmenu", (event) => {
        handleClick(row, column, event);
        event.preventDefault();
    });
    return td;
}

function createTable(rows, columns) {
    for (let i = 0; i < rows; i++) {
        let rowArray = [];
        const tr = document.createElement("tr");

        for (let j = 0; j < columns; j++) {
            if (i == 6 && j == 6) {
                rowArray.push("normal");
                let td = createTdElement("normal", i, j);
                tr.appendChild(td);
            } else {
                rowArray.push("");
                let td = createTdElement("", i, j);
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
            tr.appendChild(createTdElement(map[i][j], i, j));
        }
        mapTable.appendChild(tr);
    }
}

function handleClick(x, y, event) {
    // event.button == 0 - left
    // event.button == 1 - scroll
    // event.button == 2 - right

    if (event.button == 0) {
        map[x][y] = currentRoomType;
    } else if (event.button == 2) {
        map[x][y] = "";
    }

    updateWholeTable();
}

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

// init
createTable(13, 13);
createMenu();
