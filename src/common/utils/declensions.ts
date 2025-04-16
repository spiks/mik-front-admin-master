import {createDeclension} from './formatters'

export const formatYearDeclension = createDeclension({
    one: 'Год',
    two: 'Года',
    few: 'Лет'
})

export const formatDaysDeclension = createDeclension({
    one: 'День',
    two: 'Дня',
    few: 'Дней'
})