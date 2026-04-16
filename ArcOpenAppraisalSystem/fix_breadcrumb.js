const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f === 'replace_breadcrumb.js');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace breadcrumb logic
    content = content.replace(
        /var currentUrl = 'index\.html';\s*var href = window\.location\.href;\s*for \(var key in urlMap\) \{\s*if \(href\.indexOf\(urlMap\[key\]\) !== -1\) \{\s*currentUrl = urlMap\[key\];\s*break;\s*\}\s*\}/,
        `var currentUrl = 'index.html';
                var href = window.location.href;
                var sortedKeys = Object.keys(urlMap).sort(function(a, b) {
                    return urlMap[b].length - urlMap[a].length;
                });
                for (var i = 0; i < sortedKeys.length; i++) {
                    var key = sortedKeys[i];
                    if (href.indexOf(urlMap[key]) !== -1) {
                        currentUrl = urlMap[key];
                        break;
                    }
                }`
    );

    // Replace navbar logic too, to be safe.
    content = content.replace(
        /var currentPath = 'index\.html';\s*var href = window\.location\.href;\s*for \(var key in map\) \{\s*if \(href\.indexOf\(map\[key\]\) !== -1\) \{\s*currentPath = map\[key\];\s*break;\s*\}\s*\}/,
        `var currentPath = 'index.html';
                    var href = window.location.href;
                    var sortedMapKeys = Object.keys(map).sort(function(a, b) {
                        return map[b].length - map[a].length;
                    });
                    for (var i = 0; i < sortedMapKeys.length; i++) {
                        var key = sortedMapKeys[i];
                        if (href.indexOf(map[key]) !== -1) {
                            currentPath = map[key];
                            break;
                        }
                    }`
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});