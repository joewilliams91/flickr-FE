import React, { Component } from "react";
import { Link } from "@reach/router";

export default class FavouritePage extends Component {
  state = {
    favourites: [],
    searchTerm: ""
  };

  componentDidMount() {
    let values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

    while (i--) {
      values.push(JSON.parse(localStorage.getItem(keys[i])));
    }

    this.setState({ favourites: values });
  }

  getAuthor = author => {
    const newAuthor = author.slice(20, author.length - 2);
    return newAuthor;
  };

  getDateString = date => {
    const dayObj = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    };

    const monthObj = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December"
    };

    const getDateEnding = day => {
      const dayObj = {
        0: "th",
        1: "st",
        2: "nd",
        3: "rd",
        4: "th",
        5: "th",
        6: "th",
        7: "th",
        8: "th",
        9: "th"
      };

      return day + dayObj[day.slice(1)];
    };

    let newDate = new Date(date).toString().slice(0, -31);
    newDate = newDate.replace(/(\d{2})(?= \d{4})/g, x => getDateEnding(x));
    newDate = newDate.replace(
      /^(\w+) /g,
      x => dayObj[new Date(date).getDay()] + ", "
    );
    newDate = newDate.replace(
      /(\w+)(?= \d{2}\w{2} \d{4})/g,
      x => monthObj[x] + " the "
    );
    newDate = newDate.replace(/(\d{4})/, `$1 at`);
    return newDate;
  };

  removeImageFromFavourites = link => {
    localStorage.removeItem(link);
    this.setState(currentState => {
      const newFavourites = currentState.favourites.filter(
        image => image.link !== link
      );
      return { ...currentState, favourites: newFavourites };
    });
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ searchTerm: e.target.value });
  };

  handleSubmit = e => {
    const { searchTerm } = this.state;
    e.preventDefault();
    this.props.navigate("/", { state: { searchTerm: searchTerm } });
  };

  render() {
    const { favourites, searchTerm } = this.state;
    return (
      <div className="container">
        <div className="header">
          <h2 style={{ color: "rgb(13, 14, 20)" }}>Favourites</h2>
          <form onSubmit={this.handleSubmit}>
            <input value={searchTerm} onChange={this.handleChange}></input>
            <button>Search</button>
          </form>
          <Link to="/" style={{ color: "rgb(13, 14, 20)" }}>
            <h2>Images</h2>
          </Link>
        </div>

        <div className="images-grid">
          {favourites.length > 0 &&
            favourites.map((item, index) => {
              return (
                <div className="search-image-box">
                  <div className="search-image-box-top">
                    <img
                      className="search-image"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        this.openImage(item.link);
                      }}
                      key={index}
                      alt={item.title}
                      src={item.media.m}
                    />
                  </div>
                  <div className="search-image-box-bottom">
                    <p>Author: {this.getAuthor(item.author)}</p>
                    <p>Taken: {this.getDateString(item.date_taken)}</p>
                    <p>Title: {item.title}</p>
                    <p>Tags: {item.tags}</p>
                  </div>
                  <div className="search-image-box-favourite">
                    <button
                      onClick={() => {
                        this.removeImageFromFavourites(item.link);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
