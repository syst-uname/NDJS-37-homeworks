#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv)) 
  .option('year', { alias: 'y', description: 'год' }) 
  .option('month', { alias: 'm', description: 'месяц' }) 
  .option('date', { alias: 'd', description: 'день' })  
  .command('add [param] [count]', 'дата в будущем', 
    (yargs) => yargs
      .positional('param', { demandOption: true, describe: 'параметр даты YYYY-MM-DD' }) 
      .positional('count', { demandOption: true, describe: 'количество' }),
      (argv) => { 
        const date = changeDate(new Date(), argv.y, argv.m, argv.d)
        outputDate(date)
      }
    )
    .command('sub [param] [count]', 'дата в прошлом', 
      (yargs) => yargs
      .positional('param', { describe: 'параметр даты YYYY-MM-DD' }) 
      .positional('count', { describe: 'количество' }),  
    (argv) => { 
      const date = changeDate(new Date(), argv.y, argv.m, argv.d, -1)
      outputDate(date)
    }
  )
  .implies({
    year: ['--no-month', '--no-date'],
    month: ['--no-date'], 
  })
  .strict()
  .parse()
   

if (argv._.length === 0) {         // опции, а не команды 
  outputDate(new Date(), argv.y, argv.m, argv.d)
}


// вывод всей даты или отдельных частей
function outputDate(date, y, m, d) {
  if (y) 
    console.log(date.getFullYear())
  else if (m) 
    console.log(date.getMonth() + 1)
  else if (d) 
    console.log(date.getDate())
  else
    console.log(date.toISOString()) 
}

// изменение даты в прошлое или будущее
function changeDate(date, y, m, d, sign = 1) {
  let result = new Date(date);
  if (y) 
    result.setFullYear(result.getFullYear() + y * sign);
  else if (m) 
    result.setMonth(result.getMonth() + m * sign);
  else if (d)  
    result.setDate(result.getDate() + d * sign);

  return result
}