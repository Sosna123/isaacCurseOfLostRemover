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

function createTable(rows, columns) {
    let mapHTML = "";
    for (let i = 0; i < rows; i++) {
        let rowArray = [];
        mapHTML += "<tr>";

        for (let j = 0; j < columns; j++) {
            if (i == 6 && j == 6) {
                mapHTML += `<td class='roomTd' onclick='handleClick(${i}, ${j}, "left")' oncontextmenu='handleClick(${i}, ${j}, "right", event)'></td>`;
                rowArray.push("normal");
            } else {
                mapHTML += `<td onclick='handleClick(${i}, ${j}, "left")' oncontextmenu='handleClick(${i}, ${j}, "right", event)'></td>`;
                rowArray.push("");
            }
        }

        mapHTML += "</tr>";
        map.push(rowArray);
    }

    mapTable.innerHTML = mapHTML;
}

function updateTable() {
    let mapHTML = "";

    for (let i = 0; i < map.length; i++) {
        mapHTML += "<tr>";
        for (let j = 0; j < map[i].length; j++) {
            let roomIdClass = map[i][j] == "" ? "" : "class='roomTd'";

            mapHTML += `<td ${roomIdClass} onclick='handleClick(${i}, ${j}, "left")' oncontextmenu='handleClick(${i}, ${j}, "right", event)'>`;

            if (map[i][j] == "normal" || map[i][j] == "") {
                mapHTML += "";
            } else {
                mapHTML += `<img draggable='false' src='./imgs/${map[i][j]}.webp' class='imgTd'></img>`;
            }

            mapHTML += "</td>";
        }
        mapHTML += "</tr>";
    }

    mapTable.innerHTML = mapHTML;
}

function handleClick(x, y, mouseBtn, event) {
    map[x][y] = mouseBtn == "left" ? currentRoomType : "";
    updateTable();

    if (mouseBtn == "right") {
        event.preventDefault();
    }
}

function createMenu() {
    menuHTML = "";

    for (let i = 0; i < roomTypes.length; i++) {
        menuHTML += `<div class='roomTypeButton' onclick='changeSelectedRoomType(\"${roomTypes[i]}\")'>`;
        menuHTML += i == 0 ? "normal room" : `<img draggable='false' src='./imgs/${roomTypes[i]}.webp'></img>`;
        menuHTML += "</div>";
    }

    clickMenu.innerHTML = menuHTML;
}

function changeSelectedRoomType(roomType) {
    currentRoomType = roomType;
}

// init
createTable(13, 13);
createMenu();
