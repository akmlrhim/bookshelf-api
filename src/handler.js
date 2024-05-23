const { nanoid } = require("nanoid");
const book = require("./books");
const books = require("./books");

//fungsi untuk menambahkan buku
const addBook = (request, handler) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (name == false) {
    const response = handler
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = handler
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }
  const id = nanoid(16);
  const finished = pageCount === readPage ? true : false;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  book.push({
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  });

  //fungsi untuk memberikan respon jika fungsi addBook berhasil
  const isSuccess = book.filter((b) => b.id === id).length > 0;
  if (isSuccess) {
    const response = handler
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  //fungsi jika gagal
  const response = handler
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
  return response;
};

//fungsi untuk mengambil semua data buku
const getBook = (request, handler) => {
  const { name, reading, finished } = request.query;
  if (name) {
    let book = book.filter((b) => b.name.toLowerCase() === name.toLowerCase());
    return handler
      .response({
        status: "success",
        data: {
          books: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }

  if (reading) {
    let book = book.filter((b) => Number(b.reading) === reading);
    return handler
      .response({
        status: "success",
        data: {
          books: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }
  if (finished) {
    let book = book.filter((b) => Number(b.finished) === finished);
    return handler
      .response({
        status: "success",
        data: {
          books: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }
  if (!name && !reading && !finished) {
    return handler
      .response({
        status: "success",
        data: {
          books: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }
};

//mengambil satu data buku saja (berdasarkan Id)
const getBookById = (request, handler) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }
  const response = handler
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
  return response;
};

//update data buku
const editBook = (request, handler) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  if (name === undefined) {
    const response = handler
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = handler
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
    return response;
  }
  const updatedAt = new Date().toISOString();
  const index = book.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    book[index] = {
      ...book[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = handler
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
    return response;
  }
  const response = handler
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

//hapus data buku
const deleteBook = (request, handler) => {
  const { bookId } = request.params;
  const index = book.findIndex((b) => b.id === bookId);
  if (index !== -1) {
    book.splice(index, 1);
    const response = handler
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
    return response;
  }
  const response = handler
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
  return response;
};

module.exports = {
  addBook,
  getBook,
  getBookById,
  editBook,
  deleteBook,
};
