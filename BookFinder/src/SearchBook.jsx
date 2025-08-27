import { useState } from "react";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import "./SearchBook.css";
import { NO_RESULTS_FOUND, API_ERROR } from "./messages";

// Function to fetch books from api by user search.
function SearchBook() {
  const [searchInput, setSearchInput] = useState("");
  const [dataNotFound, setDataNotFound] = useState(false);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");

  const findBooks = () => {
    setDataNotFound(false);
    setErr("");
    if (!searchInput) return;
    setIsLoading(true);
    axios
      .get(`https://openlibrary.org/search.json?title=${searchInput}`)
      .then((response) => {
        if (response.data.docs.length > 0) {
          setBooks(response.data.docs);
        } else {
          setBooks([]);
          setDataNotFound(true);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setIsLoading(false);
        setErr(API_ERROR);
      });
  };

  return (
    <>
      {/* Search Bar */}
      <header className="header">
        <div className="header-title">
          <h1>Book Finder</h1>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by book title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={findBooks}>Search</button>
        </div>
      </header>

      <div className="results-container">
        {/* Loader */}
        <BeatLoader loading={isLoading} />

        {/* books data */}
        <div className="books-grid">
          {books.length > 0 &&
            books.map((book, index) => (
              <div className="book-card" key={index}>
                {book.cover_i ? (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    alt={book.title}
                  />
                ) : (
                  <div>
                    <img
                      src="/fallBackImage.jpg"
                      alt="Image not available"
                      className="fallback-img"
                    />
                    <p>Image not available</p>
                  </div>
                )}

                <h5>
                  {book.title.length < 44
                    ? book.title
                    : book.title.substring(0, 43)}
                </h5>
                <p className="author">
                  Author: {book.author_name ? book.author_name.join(", ") : "Unknown"}
                </p>
                <p className="publish-year">
                  First published year: {book.first_publish_year || "N/A"}
                </p>
              </div>
            ))}
        </div>

        {/* No results message */}
        {dataNotFound && !isLoading && (
          <h4 className="error">{NO_RESULTS_FOUND}</h4>
        )}

        {/* API error message */}
        {err && !isLoading && <h4 className="error">{err}</h4>}
      </div>
    </>
  );
}

export default SearchBook;
