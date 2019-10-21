import React, { Component } from "react";
import Modal from "react-modal";

export default class Image extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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

  saveImageToFavourites = (link, image) => {
    localStorage.setItem(link, image);
    this.props.getImages();
  };

  openImage = image => {
    window.open(image, "_blank");
  };

  render() {
    const { item, index, type } = this.props;
    return (
      <div className="search-image-box" key={index}>
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
          <div
            onClick={() => {
              this.openModal();
            }}
            className="modal-div"
          >
            <h4 className="heading">Author: </h4>{" "}
            <p>{this.getAuthor(item.author)}</p>
            <h4 className="heading">Taken: </h4>{" "}
            <p>{this.getDateString(item.date_taken)}</p>
            <h4 className="heading">Title: </h4> <p>{item.title}</p>
            <h4 className="heading">Tags: </h4>
          </div>

          <div className="tags">
            {item.tags.split(" ").map(tag => {
              return (
                <p
                  key={item.date_taken + "/" + item.author_id + "/" + tag}
                  className="tag"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.props.tagSearch(tag);
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
            className="box-buttons"
            onClick={() => {
              type === "images"
                ? this.saveImageToFavourites(item.link, JSON.stringify(item))
                : this.props.removeImageFromFavourites(item.link);
            }}
          >
            <img
              className="box-icon"
              src={type === "images" ? "/heart.png" : "/bin.png"}
              alt={type === "images" ? "heart" : "trash"}
            />
          </button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          contentLabel="Event Modal"
        >
          <div className="modal-close">
            <button className="box-buttons" onClick={this.closeModal}>
              <img className="close-icon" src={"/close.png"} alt="close" />
            </button>
          </div>
          <div
            className="modal-page"
            dangerouslySetInnerHTML={{
              __html: item.description
            }}
          />
        </Modal>
      </div>
    );
  }
}
