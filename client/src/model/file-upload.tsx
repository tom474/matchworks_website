export const pdfDropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
        "application/pdf": [],
        "application/doc": [],
        "application/docx": [],
    },
}

export const pdfDropZoneConfigProfile = {
    maxFiles: 100,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: {
        "application/pdf": [],
        "application/doc": [],
        "application/docx": [],
    },
}

export const imageDropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
}

export const pdfOptions = {
    withCredentials: true,
}
