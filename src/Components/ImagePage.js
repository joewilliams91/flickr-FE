import React, { Component } from "react";
import { Link } from "@reach/router";
import Image from "./Image";

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

  refreshSearch = () => {
    this.setState({ searchTerm: "" }, () => {
      this.getImages();
    });
  };

  componentDidMount() {
    if (this.props.location.state) {
      if (this.props.location.state.searchTerm) {
        this.setState(
          { searchTerm: this.props.location.state.searchTerm },
          () => {
            this.props.navigate(".", { state: {}, replace: true });
            this.getImages();
          }
        );
      } else {
        this.getImages();
      }
    } else {
      this.getImages();
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

  render() {
    const { items, searchTerm } = this.state;
    return (
      <div className="container">
        <div className="header">
          <div className="header-top">
            <h2
              className="header-top-title"
              onClick={() => {
                this.refreshSearch();
              }}
            >
              Images
            </h2>

            <Link to="/favourites" className="header-top-title">
              <h2>Favourites</h2>
            </Link>
          </div>
          <form className="header-form" onSubmit={this.getImages}>
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
          {items.length > 0 &&
            items.map((item, index) => {
              return (
                <Image
                  key={index}
                  type="images"
                  item={item}
                  index={index}
                  getImages={this.getImages}
                  tagSearch={this.tagSearch}
                />
              );
            })}
        </div>
      </div>
    );
  }
}
