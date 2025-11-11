const XYZCoin = artifacts.require("XYZCoin");
const truffleAssert = require('truffle-assertions');

contract("XYZCoin", async accounts => {
    let xyzCoinInstance;
    const creator = accounts[0];
    const recipient = accounts[1];
    const spender = accounts[2];
    const other = accounts[3];
    
    beforeEach(async () => {
        xyzCoinInstance = await XYZCoin.deployed();
    });
    
    it("should get the token name correctly", async () => {
        assert.equal(await xyzCoinInstance.name(), "XYZCoin");
    });
    
    it("should get the token symbol correctly", async () => {
        assert.equal(await xyzCoinInstance.symbol(), "XYZ");
    });
    
    it("The initial token balance of the creator account is equal to the total token supply", async () => {
        const creatorBalance = await xyzCoinInstance.balanceOf(creator);
        const totalSupply = await xyzCoinInstance.totalSupply();
        assert.equal(creatorBalance.toNumber(), totalSupply.toNumber());
    });
    
    it("Tokens can be transferred using the transfer() function", async () => {
        const initialBalance = await xyzCoinInstance.balanceOf(recipient);
        
        await xyzCoinInstance.transfer(recipient, 100, { from: creator });
        
        const finalBalance = await xyzCoinInstance.balanceOf(recipient);
        assert.equal(finalBalance.toNumber(), initialBalance.toNumber() + 100);
    });
    
    it("The allowance can be set and read", async () => {
        const allowanceAmount = 50;
        
        await xyzCoinInstance.approve(spender, allowanceAmount, { from: creator });
        
        const allowance = await xyzCoinInstance.allowance(creator, spender);
        assert.equal(allowance.toNumber(), allowanceAmount);
    });
    
    it("Accounts can transfer tokens on behalf of other accounts", async () => {
        const transferAmount = 30;
        
        await xyzCoinInstance.transfer(recipient, 100, { from: creator });
        await xyzCoinInstance.approve(spender, transferAmount, { from: recipient });
        
        const initialBalance = await xyzCoinInstance.balanceOf(creator);
        await xyzCoinInstance.transferFrom(recipient, creator, transferAmount, { from: spender });
        
        const finalBalance = await xyzCoinInstance.balanceOf(creator);
        assert.equal(finalBalance.toNumber(), initialBalance.toNumber() + transferAmount);
    });
    
    it("An insufficient balance throws an error when trying to transfer tokens", async () => {
        const smallBalanceAccount = accounts[4];
        await truffleAssert.reverts(
            xyzCoinInstance.transfer(recipient, 100, { from: smallBalanceAccount }),
            "Insufficient balance"
        );
    });
    
    it("Transferring from an account that has not explicitly authorized the transfer should revert the transaction", async () => {
        await xyzCoinInstance.transfer(recipient, 50, { from: creator });
        
        await truffleAssert.reverts(
            xyzCoinInstance.transferFrom(recipient, creator, 10, { from: spender }),
            "Allowance exceeded"
        );
    });
    
    it("The transfer() function must fire the Transfer event", async () => {
        const result = await xyzCoinInstance.transfer(recipient, 10, { from: creator });
        
        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === creator && ev.to === recipient && ev.value.toNumber() === 10;
        });
    });
    
    it("The transferFrom() function must fire the Transfer event", async () => {
        await xyzCoinInstance.approve(spender, 20, { from: creator });
        
        const result = await xyzCoinInstance.transferFrom(creator, recipient, 15, { from: spender });
        
        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === creator && ev.to === recipient && ev.value.toNumber() === 15;
        });
    });
    
    it("The approve() function must fire the Approval event", async () => {
        const result = await xyzCoinInstance.approve(spender, 25, { from: creator });
        
        truffleAssert.eventEmitted(result, 'Approval', (ev) => {
            return ev.owner === creator && ev.spender === spender && ev.value.toNumber() === 25;
        });
    });
    
    it("Transfer with 0 value should still fire Transfer event", async () => {
        const result = await xyzCoinInstance.transfer(recipient, 0, { from: creator });
        
        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.value.toNumber() === 0;
        });
    });
});