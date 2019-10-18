import React, { Component } from "react";
import { Link } from "@reach/router";

export default class ImagePage extends Component {
  state = {
    items: [],
    searchTerm: ""
  };

  convertSearch = () => {
    const { searchTerm } = this.state;
    const convertedSearch = searchTerm.split(" ").join("%20");
    return convertedSearch;
  };

  tagSearch = searchTerm => {
    this.setState({ searchTerm: searchTerm }, () => {
      this.getImages();
    });
  };

  componentDidMount() {
    if (this.props.location.state.searchTerm) {
      this.setState(
        { searchTerm: this.props.location.state.searchTerm },
        () => {
          this.getImages();
        }
      );
    }
  }

  getImages = e => {
    e && e.preventDefault();
    const search = this.convertSearch();
    const _this = this;
    const _localStorage = localStorage;
    const script = document.createElement("script");
    script.src = `http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickrcb&tags=${search}`;
    script.async = true;
    document.body.appendChild(script);

    this.setState({ searchTerm: "" });

    window.flickrcb = function(data) {
      const imageList = data.items;
      const filteredList = imageList.filter(
        image => _localStorage.getItem(image.link) !== JSON.stringify(image)
      );
      _this.setState({ items: filteredList }, () => {
        window.scrollTo(0, 0);
      });
    };
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ searchTerm: e.target.value });
  };

  openImage = image => {
    window.open(image, "_blank");
  };

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

  saveImageToFavourites = (link, image) => {
    localStorage.setItem(link, image);
    this.getImages();
  };

  render() {
    const { items, searchTerm } = this.state;
    return (
      <div className="container">
        <div className="header">
          <h2 style={{ color: "rgb(13, 14, 20)" }}>Images</h2>
          <form onSubmit={this.getImages}>
            <input value={searchTerm} onChange={this.handleChange}></input>
            <button>Search</button>
          </form>
          <Link to="/favourites" style={{ color: "rgb(13, 14, 20)" }}>
            <h2>Favourites</h2>
          </Link>
        </div>

        <div className="images-grid">
          {items.length > 0 &&
            items.map((item, index) => {
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
                    <h4 className="heading">Author: </h4>{" "}
                    <p>{this.getAuthor(item.author)}</p>
                    <h4 className="heading">Taken: </h4>{" "}
                    <p>{this.getDateString(item.date_taken)}</p>
                    <h4 className="heading">Title: </h4> <p>{item.title}</p>
                    <h4 className="heading">Tags: </h4>
                    <div className="tags">
                      {item.tags.split(" ").map(tag => {
                        return (
                          <p
                            className="tag"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              this.tagSearch(tag);
                            }}
                          >
                            {tag}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className="search-image-box-favourite">
                    <button
                      onClick={() => {
                        this.saveImageToFavourites(
                          item.link,
                          JSON.stringify(item)
                        );
                      }}
                    >
                      Favourite
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
