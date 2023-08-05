import { Component } from "react";
import "./index.css";

class Details extends Component {
  state = {
    bookDetails: {},
    isUpdate: false,
  };

  componentDidMount = () => {
    this.getDetails();
  };

  getDetails = async () => {
    const { match } = this.props;
    const id = match.params.id;
    const response = await fetch(`http://localhost:5000/books/${id}/`);
    const data = await response.json();
    console.log(data.book);
    this.setState({ bookDetails: data.book });
  };

  render() {
    const { title, authors, genre, isUpdate } = this.state.bookDetails;
    return (
      <div className="detail-container">
        <div className="card">
          <p>Title: {title}</p>
          <p>Author: {authors}</p>
          <p>Genre: {genre}</p>
        </div>
      </div>
    );
  }
}

export default Details;
