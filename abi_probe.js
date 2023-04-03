const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config(".env");

const createMetadata = async (address, abi) => {
    if( data ) {
        const contract = web3.contract(abi, address)
        let vars = new Object()
        
        for(let i=0; i < abi.length; i++) {
            // if contract has view functions
            if(abi[i].type === 'function' && abi[i].stateMutability === 'view') {
                // if function has no inputs, and only one return
                if(abi[i].inputs.length == 0 && abi[i].outputs.length) {
                    // get contract variable and log it into metadata
                    const result = await contract.methods[abi[i].name]().call()
                    vars[abi[i].name] = result
                }
            }
        }

        fs.update('/data/metadata/', address, vars)
    }
}

const main = async () => {
    fs.readFile('./data/pair_created.csv', 'utf8', async function(err, data){   
        // Display the file content
        const rows = data.split('\n')
        for(let i = 5; i < 7; i++) {
        // for(let i = o; i < rows.length; i++) {
            const rowData = rows[i].split(', ')
            const abi1 = fs.readFile(`./data/abi/${rowData[3]}`)
            const abi2 = fs.readFile(`./data/abi/${rowData[4]}`)
            
            createMetadata(rowData[3], abi1)
            createMetadata(rowData[4], abi2)
            await timer(1000)
        }
    });
}

main()