export const humanFileSize = (size: number): string => {
    const i = Math.floor( Math.log(size) / Math.log(1024))

    return parseInt((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['байт', 'Кбайт', 'Мб', 'Г', 'Т'][i]
}

interface Declension {
    one: string
    two: string
    few: string
}

export const createDeclension = (values: Declension): (count: number) => string => {
    const labels: string[] = [values.one, values.two, values.few]

    return (count: number): string => {
        const cases: number[] = [2, 0, 1, 1, 1, 2]

        return labels[count % 100 > 4 && count % 100 < 20 ? 2 : cases[count % 10 < 5 ? count % 10 : 5]]
    }
}
