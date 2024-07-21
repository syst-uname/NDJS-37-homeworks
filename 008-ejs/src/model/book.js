class Book {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.authors = data.authors
    this.description = data.description
    this.favorite = data.favorite
    this.fileNameCover = data.fileNameCover
    this.fileOriginalCover = data.fileOriginalCover
    this.fileNameBook = data.fileNameBook
    this.fileOriginalBook = data.fileOriginalBook
  }
}

export default Book