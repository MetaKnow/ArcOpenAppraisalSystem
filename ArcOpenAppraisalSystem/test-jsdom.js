const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('appraisal-task-create.html', 'utf8');

const dom = new JSDOM(html, {
    url: "http://localhost:8000/appraisal-task-create.html",
    runScripts: "dangerously",
    resources: "usable"
});

setTimeout(() => {
    console.log(dom.window.document.querySelector('breadcrumb').innerHTML);
}, 2000);
