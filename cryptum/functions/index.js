const functions = require("firebase-functions");
const { privKey } = require("./constants");
const cors = require('cors')({ origin: true });
const CryptumSDK = require('cryptum-sdk')

const sdk = new CryptumSDK({
  environment: 'testnet', // 'testnet' or 'development', 'mainnet' or 'production'
  apiKey: 'SYw7ZZVUapjPXz5ZpEjIB9dxH9tbddtW',
})

exports.getNFTMetadata = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    // your function body here - use the provided req and res from cors
    // browsers like chrome need these headers to be present in response if the api is called from other than its base domain
    response.set("Access-Control-Allow-Origin", "*"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    // Send response to OPTIONS requests and terminate the function execution
    if (request.method == 'OPTIONS') {
      response.status(204).send('');
    }
  })});

exports.mintAndTransfer = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    // your function body here - use the provided req and res from cors
    // browsers like chrome need these headers to be present in response if the api is called from other than its base domain
    response.set("Access-Control-Allow-Origin", "*"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    // Send response to OPTIONS requests and terminate the function execution
    if (request.method == 'OPTIONS') {
      response.status(204).send('');
    }
    const protocol = request.body.protocol;
    const token = request.body.token;
    const account = request.body.account;
    const uri = request.body.uri;

      const wallet = await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: privKey,
        protocol: protocol,
      })
    const { hash } = await sdk.nft.mint({
      protocol:protocol, 
      wallet,
      token: token,
      destination: account,
      amount: '1',
      tokenId: 0,
      uri: uri
    })
    response.send({hash});
  })
});

exports.createNFT = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    // your function body here - use the provided req and res from cors
    // browsers like chrome need these headers to be present in response if the api is called from other than its base domain
    response.set("Access-Control-Allow-Origin", "*"); // you can also whitelist a specific domain like "http://127.0.0.1:4000"
    // Send response to OPTIONS requests and terminate the function execution
    if (request.method == 'OPTIONS') {
      response.status(204).send('');
    }
    console.log(request.body);
    // functions.logger.info("Hello logs!", { structuredData: true });
    const name = request.body.name;
    const symbol = request.body.symbol;
    //const account = request.body.account;
    const uri = request.body.uri;
    const networks = request.body.networks;

    let i = 0;
    let hashes = {};
    while (i < networks.length) {
      const network = networks[i];
      const wallet = await sdk.wallet.generateWalletFromPrivateKey({
        privateKey: privKey,
        protocol: network,
      })
      const { hash } = await sdk.nft.create({
        wallet,
        name: name,
        symbol: symbol,
        type: 'ERC721',
        uri: uri,
        protocol: network,
      })
      hashes[network] = hash;
      i++;
    }
    response.send({ hashes});
  })
});
