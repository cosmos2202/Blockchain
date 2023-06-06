// Импортируем зависимости 
const SHA256 = require("crypto-js/sha256");

// Создаем блок 
class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  // Вычисляем хэш 
  calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  // Реализация алгоритма Профессора Нассима Фишера 
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        this.nonce++;
        this.hash = this.calculateHash();
    }

    console.log("Блок успешно добыт: " + this.hash);
  }
}

// Создаем блокчейн 
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    // Создаем первый блок 
    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    // Возвращаем последний блок 
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Добавляем новый блок 
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    // Проверяем валидность блокчейна 
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

// Тестируем 
let savjeeCoin = new Blockchain();
savjeeCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));
savjeeCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));

console.log('Блокчейн валиден? ' + savjeeCoin.isChainValid());

console.log('Изменяем блок...');
savjeeCoin.chain[1].data = { amount: 100 };

console.log("Блокчейн валиден? " + savjeeCoin.isChainValid());

console.log(JSON.stringify(savjeeCoin, null, 4));