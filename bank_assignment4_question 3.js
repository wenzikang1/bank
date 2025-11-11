const Web3 = require('web3');


const INFURA_ENDPOINT = 'https://mainnet.infura.io/v3/9d8cd52faa834c36903c0d3a3acbf96a';
const web3 = new Web3(INFURA_ENDPOINT);

async function findFirstContractCreation() {
    try {
        console.log('正在连接到以太坊网络...');
        
  
        const latestBlock = await web3.eth.getBlockNumber();
        console.log(`当前最新区块号: ${latestBlock}`);
        
        console.log('开始搜索第一个合约创建交易...');
        console.log('（这可能需要几分钟时间）');
        
        const searchLimit = 50000;
        
        for (let blockNumber = 0; blockNumber <= searchLimit; blockNumber++) {
            
            if (blockNumber % 1000 === 0) {
                console.log(`已检查到区块 ${blockNumber}...`);
            }
            
            try {
                
                const block = await web3.eth.getBlock(blockNumber, true);
                
                if (block && block.transactions) {
                  
                    for (const tx of block.transactions) {
                        
                        if (tx.to === null) {
                            console.log('\n🎉 找到第一个合约创建交易！');
                            console.log('='.repeat(50));
                            console.log(`区块号: ${blockNumber}`);
                            console.log(`交易哈希: ${tx.hash}`);
                            console.log(`发送者: ${tx.from}`);
                            console.log(`区块时间: ${new Date(block.timestamp * 1000)}`);
                            console.log(`Gas 使用量: ${tx.gas}`);
                            console.log('='.repeat(50));
                            
                            return {
                                blockNumber: blockNumber,
                                transactionHash: tx.hash,
                                from: tx.from,
                                timestamp: new Date(block.timestamp * 1000),
                                gas: tx.gas
                            };
                        }
                    }
                }
            } catch (error) {
                console.log(`跳过区块 ${blockNumber}（获取失败）`);
                continue;
            }
        }
        
        console.log(`在前 ${searchLimit} 个区块中未找到合约创建交易`);
        return null;
        
    } catch (error) {
        console.error('发生错误:', error.message);
    }
}


console.log('程序开始执行...');
findFirstContractCreation().then(result => {
    if (result) {
        console.log('\n搜索完成！');
        console.log('第一个合约创建交易的信息已找到。');
    } else {
        console.log('\n搜索结束，未找到结果。');
    }
    console.log('程序退出。');
    process.exit(0);
});