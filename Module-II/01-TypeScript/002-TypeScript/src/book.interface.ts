// интерфейс книги
interface IBook {
  id: number,
  title: string,
  authors: string,
  description: string,
  favorite: number,
  fileCover: string, 
  fileBook: string, 
}

export default IBook