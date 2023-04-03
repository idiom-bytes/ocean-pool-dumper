const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config(".env");

const {
    PANCAKESWAP_V2_FACTORY,
    PANCAKESWAP_V2_FACTORY_ABI,
    UNISWAP_V2_FACTORY,
    UNISWAP_V2_FACTORY_ABI,
    UNISWAP_V3_FACTORY,
    UNISWAP_V3_FACTORY_ABI,
} = require('./factory_abis')
const {bscWssWeb3, mainnetWssWeb3} = require('./web3_utils');

console.log("bscWssWeb3: ", bscWssWeb3)

const cakev2_web3 = new bscWssWeb3.eth.Contract(PANCAKESWAP_V2_FACTORY_ABI, PANCAKESWAP_V2_FACTORY);
// const univ2_web3 = new mainnetWssWeb3.eth.Contract(UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_FACTORY);
// const univ3_web3 = new mainnetWssWeb3.eth.Contract(UNISWAP_V3_FACTORY_ABI, UNISWAP_V3_FACTORY);

const noop = () => {};
fs.writeFile('pair_created.csv', "chain, dex, timestamp, pair, token0, token1\n",noop)

function dumpPairCreatedEvent(chain, dex, blockNumber, token0, token1, pair) {
    let output = `${chain}, ${dex}, ${blockNumber}, ${token0}, ${token1}, ${pair}\n`
    fs.appendFile('pair_created.csv', output, noop)
}

// PairCreated results ==> addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline)
const dumpBSCEvents = async (startBlock, endBlock) => {
    await cakev2_web3.getPastEvents('PairCreated', {
        fromBlock: startBlock,
        toBlock: endBlock
    }, function(err, event) {
        if (err) {
            console.error('BSC Factory @ PairCreated listener error: ', err);
            return;
        }

        if( event && event.length > 0 ) {
            for(let i = 0; i < event.length; i++) {
                console.error('Token pair created: ', event[i]);
                dumpPairCreatedEvent(
                    56,
                    PANCAKESWAP_V2_FACTORY, 
                    event[i].blockNumber,
                    event[i].returnValues.token0, 
                    event[i].returnValues.token1, 
                    event[i].returnValues.pair
                )
            }
        }
    });
}

const main = async () => {
    // dumpBSCEvents(20373351, 20374351)
    dumpBSCEvents(20424000, 'latest')
}

main()
