import React, { Component } from "react";
import { Link } from "@reach/router";
import Image from "./Image";

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

  handleChange = e => {
    e.preventDefault();
    this.setState({ searchTerm: e.target.value });
  };

  handleSubmit = e => {
    const { searchTerm } = this.state;
    e && e.preventDefault();
    this.props.navigate("/", { state: { searchTerm: searchTerm } });
  };

  tagSearch = searchTerm => {
    this.setState({ searchTerm: searchTerm }, () => {
      this.handleSubmit();
    });
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

  render() {
    const { favourites, searchTerm } = this.state;
    return (
      <div className="container">
        <div className="header">
          <div className="header-top">
            <Link
              to="/"
              className="header-top-title"
              style={{ color: "rgb(13, 14, 20)" }}
            >
              <h2>Images</h2>
            </Link>
            <h2 className="header-top-title">Favourites</h2>
          </div>
          <form className="header-form" onSubmit={this.handleSubmit}>
            <input
              placeholder="Search Flickr"
              className="header-input"
              value={searchTerm}
              onChange={this.handleChange}
            ></input>
            <button className="search-button">
              <img className="arrow-icon" src={"/arrow.png"} alt="arrow" />
            </button>
          </form>
        </div>
        <div className="images-grid">
          {favourites.length > 0 ? (
            favourites.map((item, index) => {
              return (
                <Image
                  key={index}
                  type="favourites"
                  item={item}
                  index={index}
                  tagSearch={this.tagSearch}
                  removeImageFromFavourites={this.removeImageFromFavourites}
                />
              );
            })
          ) : (
            <div className="empty-favourites">
              <p className="empty-favourites-text">Favourites list is empty.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
