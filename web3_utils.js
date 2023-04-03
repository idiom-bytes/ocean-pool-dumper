const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || 'your_key_here';
const bscWebsocketUrl = `wss://wandering-neat-sponge.bsc.discover.quiknode.pro/45215ae99fb918e9dd50afdb0dc197b22cb715ea/`
const mainnetWebsocketUrl = `wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}`
const bscWssWeb3 = new Web3(new Web3.providers.WebsocketProvider(bscWebsocketUrl));
const mainnetWssWeb3 = new Web3(new Web3.providers.WebsocketProvider(mainnetWebsocketUrl));

module.exports = {bscWssWeb3, mainnetWssWeb3};
