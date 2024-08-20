#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import http from 'http';
import config from 'config';
import dotenv from 'dotenv';

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .option('city', {
    alias: 'c',
    type: 'string',
    default: 'Москва',
    description: 'Название города'
  })
  .strict()
  .parse()

const weatherUrl = config.get('WEATHER_URL')
const url = `${weatherUrl}&key=${process.env.API_KEY}&q=${argv.city}`

http.get(url, res => {
  if (res.statusCode !== 200) {
    console.error(`Ошибка получения данных: ${res.statusCode}`)
  } else {
    res.setEncoding('utf8')
    let rowData = ''
    res.on('data', chunk => { rowData += chunk })
    res.on('end', () => {
      const data = JSON.parse(rowData)
      outputDate(data.data)
    })
  }
}).on('error', err => {
  console.error(`Ошибка получения данных: ${res.statusCode}`)
})

function outputDate(date) {
  if (date.error) {
    console.error(`Ошибка: ${date.error[0].msg}`)
  } else {
    console.log(`Город: ${date.request[0].query}`)
    console.log(`Температура: ${date.current_condition[0].temp_C} °C`)
  }
}