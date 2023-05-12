const express = require("express");
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const url=require('url')
const querystring=require('querystring')


const configuration = new Configuration({
    basePath: PlaidEnvironments.development,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '64226b0770185800147fdf0d',
            'PLAID-SECRET': '4de4a569525971b222a29eaa088610',
        },
    },
});

const plaidClient = new PlaidApi(configuration);


const configuration2 = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': '64226b0770185800147fdf0d',
            'PLAID-SECRET': '6d19a956b7f1706f8c932f91786945',
        },
    },
});

const plaidClient2 = new PlaidApi(configuration2);

router.post("/hello", (request, response) => {
    response.json({message: "hello " + request.body.name});
});

router.post('/create_link_token', async function (request, response) {
    console.log(plaidClient)
    console.log("breal")
    console.log(plaidClient2)

    const plaidRequest = {
        user: {
            client_user_id: 'user',
        },
        client_name: 'Plaid Test App',
        products: ['auth'],
        language: 'en',
        redirect_uri: 'https://redirectmeto.com/http://localhost:3500',
        country_codes: ['US'],
    };
    try {
        const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
        response.json(createTokenResponse.data);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.toString() });
    }
    
});

router.post("/auth", async function(request, response) {
   try {
       const access_token = request.body.access_token;
       const plaidRequest = {
           access_token: access_token,
       };
       const plaidResponse = await plaidClient.authGet(plaidRequest);
       response.json(plaidResponse.data);
   } catch (e) {
       response.status(500).send("failed");
   }
});

router.post('/exchange_public_token', async function (
    request,
    response,
    next,
) {
    const publicToken = request.body.public_token;
    try {
        const plaidResponse = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        // These values should be saved to a persistent database and
        // associated with the currently signed-in user
        const accessToken = plaidResponse.data.access_token;
        response.json({ accessToken });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: error.toString() });
    }
    
});

router.get('/transactions', async function(request, response) {
    const parsedUrl=url.parse(request.url)
    const parsedQuery=querystring.parse(parsedUrl.query)

    const accessToken=parsedQuery.accessTokens
    const req = {
        access_token: accessToken,
        start_date: '2018-01-01',
        end_date: '2023-02-01'
      };
      try {
        const plaidResponse = await plaidClient.transactionsGet(req);
        let transactions = plaidResponse.data.transactions
        console.log("uuuuuuuuuu")

        console.log(transactions)
        console.log("WOOORK")

        response.json(transactions)
        
      } catch(err)  {
         console.log(err)
         console.log("NoWOOORK")

         response.status(500).send("failed");
      }
})
  

module.exports = router;
