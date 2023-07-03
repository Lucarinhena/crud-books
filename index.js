const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const port = 3000;

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars"); // Setando os handlebars para usá-lo
app.use(express.static("public")); // Função para utilizar o css na pasta 'public'

app.use(
  express.urlencoded({
    extended: true,
  }), // Middlewares para acessar os dados pelo corpo da url
);
app.use(express.json());

// Rota para a home
app.get("/", (req, res) => {
  res.render("home");
});
//------------------------------------------------------------------------------------------

// Rota para resgatar e exibir os dados do formulário
app.get("/books", (req, res) => {
  const sql = `SELECT * FROM books`;

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    const books = data;

    console.log(books);

    res.render("books", { books });
  });
});
//------------------------------------------------------------------------------------------

// Rota para exibir resultados de livros por ID
app.get("/books/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM books WHERE id = ${id}`;

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    const book = data[0];

    res.render("book", { book });
  });
});
//------------------------------------------------------------------------------------------

//Primeira parte da rota para editar os livros

app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM books WHERE id = ${id}`;

  conn.query(sql, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    const book = data[0];
    res.render("editbook", { book });
  });
});
//------------------------------------------------------------------------------------------

//Segunda parte da rota que faz a ATUALIZAÇÃO dos livros

app.post("/books/updatebooks", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const pages = req.body.pages;

  const sql = `UPDATE books SET title = '${title}', pages = '${pages}' WHERE id = '${id}'`;

  conn.query (sql, function(err, data) {
    if (err) {
      console.log(err)
      return
    }
    res.redirect ('/books')
  })
});


// Rota para a remoção de um item (livro) 

app.post ('/books/remove/:id', (req, res)=> {
  const id = req.params.id

  const sql = `DELETE FROM books WHERE id = '${id}'`
  
  conn.query (sql, function(err, data) {
    if (err) {
      console.log(err)
      return
    }
    res.redirect ('/books')
  })
  
})













//------------------------------------------------------------------------------------------

// Rota para pegar os dados do formulário e lógica para inserir no banco de Dados
app.post("/books/insertbook", (req, res) => {
  const title = req.body.title;
  const pages = req.body.pages;

  const sql = `INSERT INTO books (title, pages) VALUES ('${title}', '${pages}')`;

  conn.query(sql, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    res.redirect("/");
  });
});
//------------------------------------------------------------------------------------------

// Variável e função para conectar ao Banco de dados
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql2",
});

conn.connect(function (err) {
  if (err) {
    console.log("Failed to connect at MySQL");
  } else {
    console.log(`Connected at MySQL in port: ${port}`);
    app.listen(port);
  }
});
// ------------------------------------------------------------------------------------------
