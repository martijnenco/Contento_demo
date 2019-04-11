const https = require("https");

const SuggestionService = {
  getSuggestions: async () => {
    return await new Promise((resolve, reject) => {
      const request = https.get('https://jsonplaceholder.typicode.com/posts', (response) => {
        // handle http errors
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load data, status code: ' + response.statusCode));
        }
        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => body.push(chunk));
        // we are done, resolve promise with those joined chunks
        response.on('end', () => resolve(body.join('')));
      });

      // handle connection errors of the request
      request.on('error', (err) => reject(err))
    });
  }
};

module.exports = SuggestionService;
