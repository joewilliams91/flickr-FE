import React from "react";
import ImagePage from "./Components/ImagePage";
import FavouritePage from "./Components/FavouritePage";
import TopBar from "./Components/TopBar";
import "./App.css";
import { Router } from "@reach/router";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <TopBar/>
        <Router>
          <ImagePage path="/" />
          <FavouritePage path="/favourites" />
        </Router>
      </div>
    );
  }
}

export default App;
