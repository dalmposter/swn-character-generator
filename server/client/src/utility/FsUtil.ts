// https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
// Create a file on the users local system
// Make a dummy element that downloads the file, then click it
export function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}