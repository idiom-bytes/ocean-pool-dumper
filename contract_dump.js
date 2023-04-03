const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config(".env");

var getJSON = require('get-json');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

const noop = () => {};
const timer = ms => new Promise( res => setTimeout(res, ms));

const dumpContract = async (path, address) => {
    // TODO - Query/Save as little as needed
    // TODO - Save token name and other metadata => bsc_metadata
    // TODO - Check if address file already exists in any of the folders... if it does, then don't query bscscan
    let url = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${process.env.BSC_SCAN}`
    getJSON(url, function(error, data) {    
        if( data ) {
            // console.log(data)
            const sourceCode = data.result[0].SourceCode
            const ABI = data.result[0].ABI
            let bscMetadata = data.result[0]
            bscMetadata['SourceCode'] = data.result[0].SourceCode === 'Contract source code not verified' ? 'Verified' : 'Not Verified'
            bscMetadata['ABI'] = data.result[0].ABI === '' ? 'Verified' : 'Not Verified'

            const contractPath = path + 'contracts/' + address + ".txt"
            const abiPath = path + 'abi/' + address + ".json"
            const bscPath = path + 'bscan/' + address + ".json"
            fs.exists(contractPath, (exists) => {
                if( !exists ) {
                    if( sourceCode ) {
                        fs.writeFile(contractPath, sourceCode, noop)
                    } else {
                        fs.writeFile(contractPath, "error", noop)
                    }
                }
            });

            fs.exists(abiPath, (exists) => {
                if( !exists ) {
                    if( ABI ) {
                        fs.writeFile(abiPath, ABI, noop)
                    } else {
                        fs.writeFile(abiPath, "error", noop)
                    }
                }
            });

            fs.exists(bscPath, (exists) => {
                if( !exists ) {
                    if( bscMetadata ) {
                        fs.writeFile(bscPath, JSON.stringify(bscMetadata), noop)
                    } else {
                        fs.writeFile(bscPath, "error", noop)
                    }
                }
            });
        }
    });
}

const main = async () => {
    fs.readFile('./data/pair_created.csv', 'utf8', async function(err, data){   
        // Display the file content
        const rows = data.split('\n')
        // for(let i = 5; i < 7; i++) {
        for(let i = 0; i < rows.length; i++) {
            const rowData = rows[i].split(', ')
            dumpContract('./data/', rowData[3])
            dumpContract('./data/', rowData[4])
            await timer(1000)
        }
    });
}

main()