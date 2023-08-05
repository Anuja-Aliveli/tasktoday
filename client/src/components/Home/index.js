import { Component } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiFillDelete } from "react-icons/ai";
import Loader from "react-loader-spinner";
import "react-loading-skeleton/dist/skeleton.css";
import "./index.css";

const tabs = [
  { name: "All", id: 0 },
  { name: "Historical", id: 1 },
  { name: "Comedy", id: 2 },
  { name: "Fantasy", id: 3 },
];

const apiConstants = {
  initial: "INITIAL",
  progress: "PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class Home extends Component {
  state = {
    searchInput: "",
    bookslist: [],
    apiStatus: apiConstants.initial,
    originalList: [],
    activeId: 0,
    isAdd: false,
    title: "",
    authors: "",
    genre: "",
  };

  componentDidMount = () => {
    this.getDetails();
  };

  getDetails = async () => {
    this.setState({ apiStatus: apiConstants.progress });
    const url = `http://localhost:5000/books/`;
    const response = await fetch(url);
    const data = await response.json();
    if (response.ok === true) {
      const formattedData = data.list.map((eachItem) => ({
        bookId: eachItem.id,
        title: eachItem.title,
        authors: eachItem.authors,
        genre: eachItem.genre,
        isPopup: false,
      }));
      setTimeout(() => {
        this.setState({
          bookslist: formattedData,
          apiStatus: apiConstants.success,
          originalList: formattedData,
        });
      }, 800);
    } else {
      this.setState({ apiStatus: apiConstants.failure });
    }
  };

  renderFailure = (displayText) => (
    <div className="container">
      <p>{displayText}</p>
      <button
        className="tab active-tab"
        type="button"
        onClick={this.getDetails}
      >
        Try Again
      </button>
    </div>
  );

  renderProgress = () => (
    <div className="container">
      <Loader type="Oval" height={70} width={70} color="#ffffff" />
    </div>
  );

  onActive = (id) => {
    const { bookslist, originalList } = this.state;
    let name = tabs[id].name.toLowerCase();
    if (name === "all") {
      name = "";
      this.setState({ activeId: id, searchInput: "", bookslist: originalList });
    } else {
      const filteredList = originalList.filter(
        (eachFilter) => eachFilter.genre === name
      );
      this.setState({ activeId: id, searchInput: "", bookslist: filteredList });
    }
  };

  onDelete = async (id) => {
    try {
      const url = `http://localhost:5000/book/${id}`;
      const options = {
        method: "DELETE",
      };

      const response = await fetch(url, options);

      if (response.ok) {
        this.setState(
          { isAdd: false, title: "", genre: "", authors: "" },
          this.getDetails
        );
      } else {
        console.log("Failed to delete the book.");
      }
    } catch (error) {
      console.error("Error while deleting the book:", error);
    }
  };

  renderSuccess = () => {
    const { bookslist } = this.state;
    if (bookslist.length === 0) {
      const search = "Search Not Found";
      return this.renderFailure(search);
    }
    return (
      <ul className="book-list">
        {bookslist.map((eachBook) => (
          <li className="book-item back" key={eachBook.bookId}>
            <p className="text">
              <span>Title: </span>
              {eachBook.title}
            </p>
            <p className="text place">
              <span>Author: </span>
              {eachBook.authors}
            </p>
            <AiFillDelete
              className="icon"
              onClick={() => this.onDelete(eachBook.bookId)}
            />
            <br />
            <Link to={`/books/${eachBook.bookId}`} className="link">
              View Book
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  renderResult = () => {
    const { apiStatus } = this.state;
    const fail = "Something went wrong.";
    switch (apiStatus) {
      case apiConstants.progress:
        return this.renderProgress();
      case apiConstants.success:
        return this.renderSuccess();
      case apiConstants.failure:
        return this.renderFailure(fail);
      default:
        return null;
    }
  };

  getTabs = (eachTab) => {
    const { activeId } = this.state;
    return (
      <button
        className={activeId === eachTab.id ? `active-tab tab` : `tab`}
        type="button"
        id={eachTab.id}
        key={eachTab.id}
        onClick={() => this.onActive(eachTab.id)}
      >
        {eachTab.name}
      </button>
    );
  };

  onSearch = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  onEnter = (event) => {
    const { bookslist, originalList, searchInput } = this.state;
    if (event.key === "Enter") {
      const searchList = originalList.filter(
        (eachBook) =>
          eachBook.title === searchInput ||
          eachBook.authors === searchInput ||
          eachBook.genre === searchInput
      );
      this.setState({ bookslist: searchList });
    }
  };

  onAdd = () => {
    this.setState({ isAdd: true });
  };

  onTitle = (event) => {
    this.setState({ title: event.target.value });
  };

  onAuthor = (event) => {
    this.setState({ authors: event.target.value });
  };

  onGenre = (event) => {
    this.setState({ genre: event.target.value });
  };

  onInsert = async () => {
    try {
      const { title, authors, genre } = this.state;
      const url = "http://localhost:5000/book/";
      const obj = { title, authors, genre };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      };

      const response = await fetch(url, options);

      if (response.ok) {
        this.setState(
          { isAdd: false, title: "", genre: "", authors: "" },
          this.getDetails
        );
        console.log("Book inserted successfully!");
      } else {
        console.log("Failed to insert the book.");
      }
    } catch (error) {
      console.error("Error while inserting the book:", error);
    }
  };

  getForm = () => (
    <div className="form-container">
      <input
        type="text"
        placeholder="Enter Title"
        onChange={this.onTitle}
        className="form"
      />
      <input
        type="text"
        placeholder="Enter Author"
        onChange={this.onAuthor}
        className="form"
      />
      <input
        type="text"
        placeholder="Enter Genre"
        onChange={this.onGenre}
        className="form"
      />
      <button type="button" className="tab add" onClick={this.onInsert}>
        Insert
      </button>
    </div>
  );

  render() {
    const { bookslist, searchInput, isAdd } = this.state;
    return (
      <div className="app-container">
        <div className="input-container">
          <input
            className="input"
            placeholder="Search Book and Press Enter"
            type="search"
            value={searchInput}
            onChange={this.onSearch}
            onKeyDown={this.onEnter}
          />
          <AiOutlineSearch className="icon" />
        </div>
        <div className="tab-container">
          {tabs.map((eachTab) => this.getTabs(eachTab))}
        </div>
        <div className="books-container">{this.renderResult()}</div>
        {!isAdd && (
          <button className="tab add" type="button" onClick={this.onAdd}>
            Add
          </button>
        )}
        {isAdd && this.getForm()}
      </div>
    );
  }
}

export default Home;
