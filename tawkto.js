const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const port = 3221; // You can choose any available port

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

webhookUrl = 'https://hooks.zapier.com/hooks/catch/15130199/39qmsl8/';
webhookUr2 = 'https://hooks.zapier.com/hooks/catch/15130199/3r1tigs/';

async function CallZap(id){

    apiData = ""

    const apiUrl = 'https://api.monday.com/v2';
    const apiKey = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI2MDMwMzMwNywiYWFpIjoxMSwidWlkIjo0MzM5NDcyNiwiaWFkIjoiMjAyMy0wNi0wM1QwMTowOTozMS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTY5NjAwNzUsInJnbiI6ImFwc2UyIn0.JFILgXE6wJbSqzXMe_2hSTGgVpHPmaadWzdmFdDKzVs'; // Replace with your API key
    const query = `query {boards(ids: 1802223826) {items(ids: ${id}) {column_values {value text}}}}`; // Replace with your GraphQL query
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': apiKey,
    };
    
    await axios.post(apiUrl, { query }, { headers }).then(response => {
        const apiData = response.data;
        Cdata = {
            "email":`${apiData.data.boards[0].items[0].column_values[4].text}`,
            "phone":`${apiData.data.boards[0].items[0].column_values[5].text}`
        };
        console.log(Cdata);
        axios.post(webhookUrl, Cdata)
        axios.post(webhook2Url,Cdata)
      .then(function (response) {
        console.log('Webhook sent successfully:', response.data);
      })
      .catch(function (error) {
        console.error('Error sending webhook:', error);
      });
        console.log(JSON.stringify(apiData, null, 2));
      }).catch(error => {
        console.error('Error:', error);
      });
    

}

const WEBHOOK_SECRET = 'webhook secret key';

function verifySignature (body, signature) {
    const digest = crypto
        .createHmac('sha1', WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    return signature === digest;
};
app.post('/webhooks', function (req, res, next) {
    if (!verifySignature(req.rawBody, req.headers['x-tawk-signature'])) {
        // verification failed
        console.log('error occured');
    }
    // verification success
    console.log(res.body);
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
