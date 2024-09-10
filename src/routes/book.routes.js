const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

//middleware
const getBook = async (req, res, next) => {

    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'Id invalido' });
    }

    try {
        book= await Book.findById(id);
        if (book === null) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }
    }catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.book = book;
    next();
}

// obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('get all books', books);
        if (books.length === 0) {
            return res.status(204).json({ message: 'No se encontraron libros' });
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//crear un nuevo libro (recurso) post
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body;
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    const book = new Book({
        title,
        author,
        genre,
        publication_date
    });

    try {
        const newBook = await book.save();
        console.log('new book', newBook);
        res.status(201).json(newBook);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

})
 
// obtener un libro por id
router.get('/:id', getBook,async (req, res) => {
res.json(res.book);

})

// put actualizar un libro
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
 
        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
 });
// patch actualizar un libro
router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;
 
        const updatedBook = await book.save()
        res.json(updatedBook)
    } catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
 });
 // delete eliminar un libro
 router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

module.exports = router;
