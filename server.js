const Service = require('node-windows').Service;

const svc = new Service({
    name: 'REST_API_NODE_JS-Finanzas',
    description: '',
    
    script: 'C:\\Users\\lindac\\Documents\\Proyectos GitHub\\REST_API_NODE_JS-Finanzas\\app.js'
})

svc.on('install', function(){
    svc.start();
});

svc.install();