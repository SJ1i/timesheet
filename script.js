const columns = getColumns();
const durations = [];

const button = document.getElementsByTagName("button")[0];
button.addEventListener("click", (event) => {
    event.preventDefault();
    addRow();
});

document.addEventListener("input", (event) => {
    let target = event.target;
    let flag = checkValue(target);
    if (flag[0]) {
        let result = getResult(flag[1], target, flag[2]);
        let display = columns[2].getElementsByTagName("input").item(flag[2]);
        display.value = result;
        modifyCumulative();
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
        if (!durations[i]) {
            durations[i] = {
                "hr": 0,
                "min": 0
            }
        }
    }
}

function rowClone(){
    return columns.map((col) => {
        let cellClone = col.getElementsByTagName("li")[1].cloneNode(true);
        cellClone.style = "";

        let inputBox = cellClone.getElementsByTagName("input")[0];
        inputBox.value = "";
        inputBox.setAttribute("placeholder", "00:00");

        return cellClone;
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

function getResult(time1, target, index) {
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
            durations[index] = {
                "hr": 0,
                "min": 0
            }
            return "invalid time";
    }

    let hrDiff = end[0] - start[0];
    let minDiff = end[1] - start[1];
    if (minDiff < 0) {
        hrDiff -= 1;
        minDiff += 60;
    }

    durations[index] = {
        "hr": hrDiff,
        "min": minDiff
    };

    hrDiff = hrDiff < 10 ? "0"+hrDiff : hrDiff;
    minDiff = minDiff < 10 ? "0"+minDiff : minDiff;
    return `${hrDiff}:${minDiff}`;
}

function modifyCumulative() {
    let display = document.getElementById("cumulative-time");
    let resultHr = 0;
    let resultMin = 0;

    let amount = columns[2].getElementsByTagName("input").length;
    for (let i = 0; i < amount; i++) {
        resultHr+=durations[i].hr;
        resultMin+=durations[i].min;
        if (resultMin >= 60) {
            resultHr++;
            resultMin-=60;
        }
    }

    resultHr = resultHr < 10 ? "0"+resultHr : resultHr;
    resultMin = resultMin < 10 ? "0"+resultMin : resultMin;
    display.textContent = `${resultHr}:${resultMin}`;
}

document.addEventListener("keydown", (event) => {
    let className = event.target.getAttribute("class");

    if (event.code === "Tab" &&
        (className === "start" || className === "end")) {
        event.preventDefault();
        let destination = getTabDestination(document.activeElement, className);
        destination.focus();
    }
});

function getTabDestination(focus, className) {
    let focusColumn = undefined;
    let destinationColumn = undefined;
    let isEnd = false;

    if (className === "start") {
        focusColumn = columns[0];
        destinationColumn = columns[1];
    } else {
        focusColumn = columns[1];
        destinationColumn = columns[0];
        isEnd = true;
    }

    let index = [...focusColumn.getElementsByTagName("input")].indexOf(focus);
    if (isEnd) index++;
    let destination = destinationColumn.getElementsByTagName("input").item(index);
    if (!destination) destination = button;

    return destination;
}