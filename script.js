const columns = getColumns();

const button = document.getElementsByTagName("button")[0];
button.addEventListener("click", (event) => {
    event.preventDefault();
    addRow();
});

function getColumns() {
    let firstCol = document.getElementById('first-col');
    let secondCol = document.getElementById('second-col');
    let thirdCol = document.getElementById('third-col');
    return [firstCol, secondCol, thirdCol];
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
        clone.getElementsByTagName("input")[0].value="";
        return clone;
    });
}