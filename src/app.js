// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
      this.lender = {name: 'N/A', id: '', lendingDate: null, returnDate: null}
    }
  }
  
  // UI Class: Handle UI Tasks
  class UI {
    static displayBooks() {
      const books = Store.getBooks();
      books.forEach((book) => UI.addBookToList(book));
    }

    static refreshPage() {
      window.location.reload()
    }
  
    static addBookToList(book) {
      const list = document.querySelector('#book-list');
  
      const row = document.createElement('tr');
  
      row.innerHTML = `
      <td>${book.lender.name}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><button id="lend"> Lend </button></td>
        <td><button id="return" > Return</button> </td>
        <td><button class="btn btn-danger btn-sm delete">Delete</button></td>
        <td><button id="lendingDetails" >Lending Details</td>

        
      `;
  
      list.appendChild(row);
    }
  
    static deleteBook(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // Vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }

    static displayLenderDetails(isbn){
      const books = Store.getBooks();
      books.forEach((book) => {
        if(book.isbn === isbn) {
          window.alert(`Book taken by ${book.lender.name} on ${book.lender.lendingDate}`)
        }
      });

    }
  }
  
  // Store Class: Handles Storage
  class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static addBook(book) {
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }

  
    static addLender(isbn,lenderName){
      const books = Store.getBooks();

      books.forEach((book) => {
        if(book.isbn === isbn) {
          book.lender= {name: lenderName, id: lenderName, lendingDate: new Date().toLocaleDateString(), returnDate: null}
        }
      });
      localStorage.setItem('books', JSON.stringify(books));

    }

    static removeLender(isbn){
      const books = Store.getBooks();

      books.forEach((book) => {
        if(book.isbn === isbn) {
          book.lender= {name: 'N/A', id: '', lendingDate: null, returnDate: new Date().toLocaleDateString()}
        }
      });
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  
  // Event: Display Books
  document.addEventListener('DOMContentLoaded', UI.displayBooks);
  
  // Event: Add a Book
  document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
  
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
  
    // Validate
    if(title === '' || author === '' || isbn === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      // Instatiate book
      const book = new Book(title, author, isbn);
  
      // Add Book to UI
      UI.addBookToList(book);
  
      // Add book to store
      Store.addBook(book);
  
      // Show success message
      UI.showAlert('Book Added', 'success');
  
      // Clear fields
      UI.clearFields();
    }
  });
  
  // Events: Remove, Lend or Return
  document.querySelector('#book-list').addEventListener('click', (e) => {

    if(e.target.textContent === "Delete"){
    // Remove book from UI
    UI.deleteBook(e.target);
    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);

    // Show success message
    UI.showAlert('Book Removed', 'success');
    }

    // Lend book 
    
    else if (e.target.id === 'lend'){
      if(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent === 'N/A'){
      const lenderName = window.prompt('Lender name ?')
      if(lenderName){
        // Add lender in store
      Store.addLender(e.target.parentElement.previousElementSibling.textContent,lenderName)
      e.target.parentElement.nextElementSibling.firstChild.disabled = false
      // Display lender in UI
      UI.refreshPage()
      }   else return 
      
    }
    else window.alert(`Book Unavailable in Library `)
  }
    // Return Book
    else if (e.target.id === 'return'){
      if(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent !== 'N/A'){
        const confirmReturnBook = window.confirm('Are you sure book is returned ?')
      confirmReturnBook ? Store.removeLender(e.target.parentElement.previousElementSibling.previousElementSibling.textContent) : ''
      UI.refreshPage()
      }
      else window.alert('Book is still in Library and cannot be returned')
      
    }

    // Display Lender Details
     
    else if (e.target.id === 'lendingDetails'){
      UI.displayLenderDetails(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent)
    }

  });