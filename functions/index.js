const functions = require('firebase-functions');
const handler   = require('./src');

exports.helloWorld = functions
                    .runWith({ memory: '1GB', timeoutSeconds: 540 })
                    .https
                    .onRequest((request, response) => handler);
