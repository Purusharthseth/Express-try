import 'dotenv/config'
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan"; 

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

let bookdata=[];
let nextId=1;
//add new book.
app.post('/books', (req, res)=>{
    logger.info("A post request was made, just now.")
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