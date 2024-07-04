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
    description: 'имя файла с логами' 
  })  
  .strict()
  .parse()
  
  
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fileStream = fs.createReadStream(path.join(__dirname, '..', '01-heads-or-tails', 'log', argv.filename), "utf-8")    // обращение к соседней папке - не самый лучший вариант
fileStream.on('error', (err) => { 
  console.log('Ошибка при чтении файла: ', err.message) 
  process.exit(1)
})
const rl = readline.createInterface({input: fileStream})



const results = await parseLog(rl)
const total = countTotal(results)

console.log(`Общее количество партий: ${total.parties}`)
console.log(`Количество выигранных партий: ${total.win}`)
console.log(`Количество проигранных партий: ${total.lose}`)
console.log(`Процентное соотношение выигранных партий: ${total.winPerc}`)



async function parseLog(rl) { 
  let results = []  
  for await (const line of rl) { 
    results.push(JSON.parse(line))
  }
  return results
}

function countTotal(results) {
  const parties = results.length
  const win = results.filter(item => item.right).length
  const lose = results.filter(item => !item.right).length 
  const winPerc = parties ? Math.round(win / parties * 100) : 0  
  return {
    parties: parties,
    win: win,
    lose: lose,
    winPerc: winPerc
  }
}