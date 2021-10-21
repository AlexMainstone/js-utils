var params = CodeMirror.defaults;
params.lineNumbers = true;
params.mode = "application/json";
params.indentWithTabs = true;
params.gutters = ["CodeMirror-lint-markers"];
params.lint = true;

let p = new URLSearchParams(location.search);
let test = p.get("json");

function onCollapsibleClick() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function setupCollapsible() {
    var coll = document.getElementsByClassName("collapsible");

    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", onCollapsibleClick);
    }
}

function removeCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].removeEventListener("click", onCollapsibleClick);
    }
    document.getElementById("error-msgs").innerHTML = "";
}

function parseJSON(text) {
    var json_obj = null;
    json_obj = JSON.parse(text);
    // let results = json_obj.QuoteResults.Results;
    var product_groups = json_obj["QuoteResults"][0]["Results"][0]["ProductGroups"];

    var error_div = document.getElementById("error-msgs");
    var error_inner = "";

    for (const i in product_groups) {
        // alert(product_groups[i]["FacilityType"]);
        error_inner += '<button type="button" class="collapsible">' + product_groups[i]["FacilityType"] + '</button>\n' +
            '<div class="content">\n'

        for (const j in product_groups[i]["ProductQuotes"]) {
            var product = product_groups[i]["ProductQuotes"][j];
            var state = "";
            if (product["hasErrors"]) {
                error_inner += '<button type="button" class="collapsible errors">' + product["ProductName"] + '</button>\n' +
                    '<div class="content">\n';

                if (product["Errors"]["hasPublicErrors"]) {
                    error_inner += 'Public:<ul>';
                    for (const k in product["Errors"]["PublicErrors"]) {
                        error_inner += "<li>" + product["Errors"]["PublicErrors"][k]["Message"] + "</li>";
                    }
                    error_inner += '</ul>\n';
                }


                if (product["Errors"]["hasPrivateErrors"]) {
                    error_inner += 'Private:<ul>';
                    for (const k in product["Errors"]["PrivateErrors"]) {
                        error_inner += "<li>" + product["Errors"]["PrivateErrors"][k]["Message"] + "</li>";
                    }
                    error_inner += '</ul>\n';
                }


                error_inner += '</div>';
            } else {
                error_inner += '<button type="button" class="collapsible success">' + product["ProductName"] + '</button>\n' +
                    '<div class="content">\n' +
                    '<p>No Errors Found!</p>\n' +
                    '</div>\n';
            }
        }
        error_inner += "</div>";
    }
    error_div.innerHTML = error_inner;
    setupCollapsible();

    return JSON.stringify(json_obj, null, 3);
}

if (test != null) {
    params.value = parseJSON(test);
}

var editor = CodeMirror(document.getElementById("textfield"), params);

document.getElementById("generate").addEventListener("click", function () {
    removeCollapsible();
    editor.setValue(parseJSON(editor.getValue()));
});