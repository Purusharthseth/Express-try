import 'dotenv/config'
import express from 'express'

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

let bookdata=[];
let nextId=1;
//add new book.
app.post('/books', (req, res)=>{

    const {name, price}=req.body
    const newBook= {id: nextId++, name, price}
    bookdata.push(newBook)
    res.status(201).send(newBook);
})

//get whole books list.
app.get('/books', (req, res)=>{
    res.status(200).send(bookdata);
})

//get a book by id.
app.get('/books/:id', (req, res)=>{
    const book = bookdata.find(t=> t.id===parseInt(req.params.id));
    if(!book){
        return res.status(404).send("Bro, not found.")
    } 
    res.status(200).send(book);
})

//update book
app.put('/books/:id', (req, res)=>{
    const book = bookdata.find(t=> t.id===parseInt(req.params.id));
    if(!book){
        return res.status(404).send("Bro, not found.")
    } 
    const {name, price}= req.body;
    book.name=name;
    book.price=price;
    res.status(200).send(book);
})
//delete book
app.delete('/books/:id', (req, res)=>{
    const index = bookdata.findIndex(t=> t.id===parseInt(req.params.id));
    if(index===-1) return res.status(404).send("book not found, boi.")

    bookdata.splice(index, 1);
    return res.status(200).send("succefully deleted.");
    
})
app.listen(port, ()=>{
    console.log(`Server is listening at port ${port}`);

})