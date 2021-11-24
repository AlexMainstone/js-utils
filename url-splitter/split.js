var input = document.getElementById("txtInput");
var fields = document.getElementById("fields");

function getFields(val) {
    let init_split = val.split("?")[1].split("&");
    let split = [];
    for(let i = 0; i < init_split.length; i++) {
        split.push(init_split[i].split("="));
    }

    let string = "<table id='table'>";
    for(let i = 0; i < split.length; i++) {
        string += "<tr><td>" + split[i][0] + "</td> <td><input value='" + split[i][1] + "'></td></tr>";
    }
    string += "</table>";
    fields.innerHTML = string;
}

let params = new URLSearchParams(location.search);
let test = params.get('search');
if(test != null) {
    input.value = test;
    getFields(test);
}


input.addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        getFields(input.value);
    }
})


var table = document.getElementById("table");
function generateButton() {
    let final_url = input.value.split("?")[0] + "?";
    for(let i = 0, row; row = table.rows[i]; i++) {
        let name = row.cells[0].innerHTML;
        let val = row.cells[1].firstChild.value;
        final_url += name + "=" + val + "&";
    }
    final_url = final_url.slice(0, -1);
    document.getElementById("txtOutput").value = final_url;
}

