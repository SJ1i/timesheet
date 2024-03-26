const columns = getColumns();

const button = document.getElementsByTagName("button")[0];
button.addEventListener("click", (event) => {
    event.preventDefault();
    addRow();
});

document.addEventListener("input", (event) => {
    let target = event.target;
    let flag = checkValue(target);
    if (flag[0]) {
        let result = getResult(flag[1], target);
        let display = columns[2].getElementsByTagName("input").item(flag[2]);
        display.value = result;
    }
});

function getColumns() {
    let columnsID = ["first-col", "second-col", "third-col"];
    return columnsID.map((id) => {
        return document.getElementById(id);
    });
}

function addRow() {
    let clones = rowClone();
    for (let i = 0; i < columns.length; i++) {
        columns[i].appendChild(clones[i]);
    }
}

function rowClone(){
    return columns.map((col) => {
        let clone = col.getElementsByTagName("li")[1].cloneNode(true);
        let timeInput = clone.getElementsByTagName("input")[0];
        timeInput.value = "";
        timeInput.setAttribute("placeholder", "00:00");
        return clone;
    });
}

function checkValue(target) {
    let targetCol = target.getAttribute("class") === "end" ? columns[1] : columns[0];
    let checkCol = target.getAttribute("class") === "end" ? columns[0] : columns[1];
    
    let index = [...targetCol.getElementsByTagName("input")].indexOf(target);
    let checkVal = checkCol.getElementsByTagName("input").item(index);

    if (checkVal.value !== "") {
        target.parentNode.style = "";
        return [true, checkVal.value, index];
    }
    else {
        checkVal.parentNode.style = "border: 1px solid red";
        return [false, null, null];
    }
}

function getResult(time1, target) {
    let start = target.getAttribute("class") === "start" ? target.value : time1;
    let end = target.getAttribute("class") === "end" ? target.value : time1;

    start = start.split(":");
    end = end.split(":");

    for (let i = 0; i < start.length; i++) {
        start[i] *= 1;
        end[i] *= 1;
    }

    if ((end[0] < start[0]) ||
        (end[0] === start[0] && end[1] < start[1])) {
            return "invalid time";
    }

    let hrDiff = end[0] - start[0];
    let minDiff = end[1] - start[1];
    if (minDiff < 0) {
        hrDiff -= 1;
        minDiff += 60;
    }
    hrDiff = hrDiff === 0 ? hrDiff+"0" : hrDiff;
    minDiff = minDiff === 0 ? minDiff+"0" : minDiff;
    return `${hrDiff}:${minDiff}`;
}