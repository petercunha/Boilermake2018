import React, { Component } from "react";
import UploadProduct from '../components/UploadProduct'
import SearchProducts from '../components/SearchProducts'
import "./App.css";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <UploadProduct />
        <SearchProducts />
      </>
    );
  }
}


export default Main;
