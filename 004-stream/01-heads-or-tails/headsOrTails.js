#!/usr/bin/env node

import yargs from "yargs"; 
import { hideBin } from "yargs/helpers";
import * as readline from 'node:readline/promises';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
 

const argv = yargs(hideBin(process.argv)) 
  .option('filename', { 
    alias: 'f', 
    type: 'string', 
    default: 'log.txt', 
    description: 'имя файла для логирования' 
  })  
  .strict()
  .parse()
  
const rl = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout 
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ws = fs.createWriteStream(path.join(__dirname, 'log', argv.filename));

while (await tossCoin()) {}
  
rl.close()
ws.end()


async function tossCoin() {  
  const goal = Math.floor(Math.random() * 2) + 1
  console.log(`Загадано случайное число (1 или 2)`);
  
  while (true) {
    const answer = await rl.question(`Ваш варианат: `);
    if (answer == 1 || answer == 2) { 
      const right = answer == goal
      writeLog(answer, right)
      console.log(right ? 'Верно!' : 'Неверно')
      break
    }
    else if (answer == 'exit') {
      return false 
    } else {
      console.log('Некорректное значение')
    }
  }
  return true
}

function writeLog(answer, right) {
  const toss = {
    answer: answer,
    right: right
  }
  ws.write(JSON.stringify(toss) + '\n');
}