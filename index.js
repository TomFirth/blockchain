const SHA256 = require('crypto-js/sha256')

class Block {
  constructor (index, timestamp, data, previousHash = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash () {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
  }

  mineBlock(difficulty) {
    while(this.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
    console.log("Block mined: ", this.hash)
  }
}

class Blockchain {
  constructor () {
    this.chain = [this.createGenesis()]
  }

  createGenesis () {
    return new Block(0, '01/01/2017', 'Genesis block', '0')
  }

  latestBlock () {
    return this.chain[this.chain.length - 1]
  }

  addBlock (newBlock) {
    newBlock.previousHash = this.latestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  checkValid () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()
        || currentBlock.previousHash !== previousBlock.hash) return false
    }
    return true
  }
}

// let beardCoin = new Blockchain()
// beardCoin.addBlock(new Block('12/25/2017', {amount: 5}))
// beardCoin.addBlock(new Block('12/26/2017', {amount: 10}))

// console.log(JSON.stringify(beardCoin, null, 4))
// console.log('Is blockchain valid?', beardCoin.checkValid())
