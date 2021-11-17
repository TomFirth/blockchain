const crypto = require('crypto')

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }

  calculateHash () {
    return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex')
  }
}

class Block {
  constructor (timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash () {
    return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex')
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
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 5
    this.pendingTransactions = []
    this.mingReward = 100
  }

  createGenesisBlock () {
    return new Block(Date.parse('2017-01-01'), [], '0')
  }

  getLatestBlock () {
    return this.chain[this.chain.length - 1]
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(Date.now(), this.pendingTransactions)
    block.mineBlock(this.difficulty)

    this.chain.push(block)
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction)
  }

  getBalanceOfAddress(address) {
    let balance = 0
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount
        }
        if (trans.fromAddress === address) {
          balance += trans.amount
        }
      }
    }
    return balance
  }

  isValid () {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()
        || currentBlock.previousHash !== previousBlock.hash) return false
    }
    return true
  }
}

module.exports.Blockchain = Blockchain
module.exports.Block = Block
module.exports.Transaction = Transaction
