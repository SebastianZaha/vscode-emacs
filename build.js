var fileName = './package.json';
var package = require(fileName);

var save = false;

// This complexity is required to make sure the 'mac' field is added right after the 'key' field.
// Even though keys in objects are said to be orderless the order of adding properties is preserved.

var bindings = package.contributes.keybindings;
for (var i in bindings) {
    var original = bindings[i];
    if (original.mac) continue;

    var mac = original.key.replace(/\bctrl\b/g, 'cmd');
    if (mac == original.key) continue;

    var updated = {};
    for (var k in original) {
        updated[k] = original[k];
        if (k === 'key') updated.mac = mac;
    }
    bindings[i] = updated;
    save = true;
}

if (save) {
    var fs = require('fs');
    fs.writeFileSync(fileName, JSON.stringify(package, null, 4) + "\n");
    console.log("Updated successfully.");
} else {
    console.log("No changes needed.")
}
