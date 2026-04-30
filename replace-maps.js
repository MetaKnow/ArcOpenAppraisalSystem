const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'ArcOpenAppraisalSystem');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
    const fullPath = path.join(dir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    // Add to map in navbar
    const mapRegex = /var map = \{([\s\S]*?)\};/;
    const mapMatch = content.match(mapRegex);
    if (mapMatch && !mapMatch[0].includes("'日志管理'")) {
        const newMapStr = mapMatch[0].replace('};', ",\n                        '日志管理': 'log-management.html'\n                    };");
        content = content.replace(mapMatch[0], newMapStr);
        changed = true;
    }

    // Add to urlMap in breadcrumb
    const urlMapRegex = /var urlMap = \{([\s\S]*?)\};/;
    const urlMapMatch = content.match(urlMapRegex);
    if (urlMapMatch && !urlMapMatch[0].includes("'日志管理'")) {
        const newUrlMapStr = urlMapMatch[0].replace('};', ",\n                    '日志管理': 'log-management.html'\n                };");
        content = content.replace(urlMapMatch[0], newUrlMapStr);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated maps in', file);
    }
}
