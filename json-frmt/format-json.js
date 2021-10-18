var params = CodeMirror.defaults;
params.lineNumbers = true;
params.mode = "application/json";
params.indentWithTabs = true;
params.gutters = ["CodeMirror-lint-markers"];
params.lint = true;

let p = new URLSearchParams(location.search);
let test = p.get('json');

var json_obj = null;
if(test != null) {
    json_obj = JSON.parse(test);
    params.value = JSON.stringify(json_obj, null, 3);
}

var editor = CodeMirror(document.body, params);
