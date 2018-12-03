import React from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../../BooksAPI";
import Book from "../Book";

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      results: [],
      query: ""
    };
  }
  componentDidMount() {
    BooksAPI.getAll().then(result => {
      this.setState({ books: result });
    });
  }

  updateQuery = query => {
    this.setState({ query: query }, this.submitSearch);
  };

  submitSearch() {
    if (this.state.query === "" || this.state.query === undefined) {
      return this.setState({ results: [] });
    }
    BooksAPI.search(this.state.query.trim()).then(res => {
      if (res.error) {
        return this.setState({ results: [] });
      } else {
        res.forEach(item => {
          let find = this.state.books.filter(myBook => myBook.id === item.id);
          if (find[0]) {
            item.shelf = find[0].shelf;
          }
        });
        return this.setState({ results: res });
      }
    });
  }

  updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf).then(res => {
      book.shelf = shelf;
      this.setState(state => ({
        books: state.books
          .filter(myBook => myBook.id !== book.id)
          .concat([book])
      }));
    });
  };
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={e => this.updateQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {this.state.results.map((item, key) => (
              <Book book={item} key={key} updateBook={this.updateBook} />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default SearchPage;
