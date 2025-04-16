const Papa = require('papaparse')

interface ParseResult {
    errors: string[]
    data: string[][]
    meta: any
}

export const parseCsvFile = async (file: File): Promise<ParseResult['data']> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            skipEmptyLines: true,
            complete: (result: ParseResult) => {
                if (result.errors.length) {
                    reject(result.errors)
                } else {
                    resolve(result.data)
                }
            }
        })
    })
}