#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import readline from 'readline';

const argv = yargs(hideBin(process.argv)) 
  .option('beg', { alias: 'b', type: 'number', default: 0, description: 'начало диапазона' }) 
  .option('end', { alias: 'e', type: 'number', default: 100, description: 'конец диапазона' }) 
  .strict()
  .parse()
  
const rl = readline.createInterface({ 
  input: process.stdin, 
  output: process.stdout 
});
 
const goal = Math.floor(Math.random() * (argv.end - argv.beg) + argv.beg)
console.log(`Загадано число в диапазоне от ${argv.beg} до ${argv.end}`)

rl.on('line', handleInput)


function handleInput(input) {
  if (input == goal) {
    console.log(`Отгадано число ${input}`)
    rl.close()
  }
  else if (input > goal) 
    console.log(`Меньше`)
  else if (input < goal) 
    console.log(`Больше`)
  else
    console.log(`Некорректное значение`)
}