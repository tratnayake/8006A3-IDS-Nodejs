var fd = process.argv[2],
ft = require('file-tail').startTailing(fd);
 
ft.on('line', function(line) {
    console.log(line);
});