import {format, isAfter, formatDistance, parseISO} from 'date-fns'
import ru from 'date-fns/locale/ru'

const dateIsoFormat = 'yyyy-MM-dd'

const DATE_FORMAT = 'dd.MM.yyyy'

export const DATE_FORMAT_WITH_LOCALIZED_MONTH: string = 'dd MMMM yyyy'

export const DATE_FORMAT_WITH_LOCALIZED_MONTH_SHORT: string = 'dd MMM yyyy'

export const DATE_FORMAT_WITHOUT_YEAR: string = 'dd MMM'

export const DATE_TIME_FORMAT: string = 'd.MM.yyyy HH:mm'

export const DATE_TIME_FORMAT_WITH_COMMA: string = 'd.MM.yyyy, HH:mm'

export const TIME_FORMAT: string = 'HH:mm'

const WRONG_DATE_MESSAGE = 'Неверный формат даты'

export const formatDate = (date: string | null, pattern = DATE_FORMAT): string =>
    date && format(new Date(date), pattern, {locale: ru}) || WRONG_DATE_MESSAGE

export const parseFromIso = (date: string): Date => parseISO(date)

export const isAfterDate = (date: string, dateToCompare: string): boolean => isAfter(new Date(date), new Date(dateToCompare))

export const formatOverdue = (date: string): string => formatDistance(new Date(date), new Date(), {locale: ru, addSuffix: false})

export const formatToIso = (date: Date) => format(date, dateIsoFormat)
