import React, { Component } from "react";

export default class ImagePage extends Component {
  state = {
    items: {},
    searchTerm: ""
  };

  convertSearch = () => {
    const { searchTerm } = this.state;
    const convertedSearch = searchTerm.split(" ").join("%20");
    return convertedSearch;
  };

  getImages = e => {
    e.preventDefault();
    const search = this.convertSearch();
    const _this = this;
    const script = document.createElement("script");
    script.src = `http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=flickrcb&tags=${search}`;
    script.async = true;
    document.body.appendChild(script);

    this.setState({ searchTerm: "" });

    window.flickrcb = function(data) {
      _this.setState({ items: data.items });
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
    const newAuthor = author.slice(20, author.length - 2)
    return newAuthor;
  }

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
    newDate = newDate.replace(/(\d{4})/, `$1 at`)
    return newDate;
  };

  render() {
    const { items, searchTerm } = this.state;

    return (
      <div className="container">
        <div className="top-bar">
          <h1>Images</h1>
          <form onSubmit={this.getImages}>
            <input value={searchTerm} onChange={this.handleChange}></input>
            <button>Search</button>
          </form>
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
                    <p>Author: {this.getAuthor(item.author)}</p>
                    <p>Taken: {this.getDateString(item.date_taken)}</p>
                    <p>Title: {item.title}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
