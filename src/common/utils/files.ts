interface FileExtensions extends Record<'doc' | 'img' | 'excel' | 'pdf', string[]> {}

const fileExtensions: FileExtensions = {
    doc: ['doc', 'docx', 'txt'],
    img: ['jpeg', 'jpg', 'png', 'bmp'],
    excel: ['xlsx', 'xls', 'csv'],
    pdf: ['pdf']
}

export const getIconName = (ext?: string) => {
    if (!ext) {
        return 'other'
    }

    const keys = Object.keys(fileExtensions) as (keyof FileExtensions)[]
    for (const key of keys) {
        if (fileExtensions[key].indexOf(ext) !== -1) {
            return key
        }
    }

    return 'other'
}

export const extensionFromFileName = (fileName: string) => fileName.split('.').pop()
