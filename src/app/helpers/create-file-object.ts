interface IFile {
  originalname: string
  size: number
  key: string
  location: string
}

interface IObjectFile {
  name: string
  size: Number
  key: string
  url: string
}

export default function createFileObject(file: IFile): IObjectFile {
  return {
    name: file.originalname,
    size: file.size,
    key: file.key,
    url: file.location,
  }
}