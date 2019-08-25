const functions = require('firebase-functions');

exports.helloWorld = functions
                    .runWith({ memory: '1GB', timeoutSeconds: 540 })
                    .https
                    .onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
