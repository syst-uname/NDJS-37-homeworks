### Результаты работы утилиты получения текущей даты и времени

Текущая дата и время в формате ISO: 
`current` 
`2024-06-30T18:07:47.132Z`

Текущий год:
`current -y`
`2024`

`current --year`
`2024`

Текущий месяц:
`current -m`
`6`

`current --month`
`6`

Дата в календарном месяце:
`current -d`
`30`

`current --date`
`30`

Дата и время на год вперед
`current add -y 1`
`2025-06-30T18:13:55.967Z`

Дата и время на 4 года назад 
`current sub -y 4`
`2020-06-30T18:14:34.855Z`

Дата и время на 7 месяцев вперед 
`current add -m 7`
`2025-01-30T18:15:17.970Z`

Дата и время на 1 месяц назад 
`current sub -m 1`
`2024-05-30T18:15:56.808Z`

Дата и время на 1 день вперед
`current add -d 1`
`2024-07-01T18:16:38.276Z`

Дата и время на 100 дней назад
`current sub -d 100`
`2024-03-22T18:16:57.428Z`

`current -abc`
`current.js [command]`

Commands:
  current.js add [param] [count]  дата в будущем
  current.js sub [param] [count]  дата в прошлом

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -y, --year     год
  -m, --month    месяц
  -d, --date     день

Unknown arguments: a, b, c


`current -y -m`
Missing dependent arguments:
 year -> --no-month
