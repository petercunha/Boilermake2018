import React, { Component } from "react";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  RefinementList,
  Pagination,
  CurrentRefinements,
  ClearRefinements
} from 'react-instantsearch-dom';
import "./App.css";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageURL: "",
      evaluation: []
    };
  }

  handleUploadImage = ev => {
    ev.preventDefault();
    const data = new FormData();
    data.append("file", ev.target.img.files[0]);
    data.append("filename", ev.target.fileName);
    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: data
    }).then(response => {
      response.json().then(body => {
        this.setState({
          imageURL: body.file,
          evaluation: body.evaluation
        });
      });
    });
  };

  render() {
    return (
      <>
        <form onSubmit={this.handleUploadImage}>
          <div>
            <input name="img" type="file" />
          </div>
          <div>
            <input
              name="fileName"
              type="text"
              placeholder="Enter the desired name of file"
            />
          </div>
          <br />
          <div>
            <button>Upload</button>
          </div>
          <img src={this.state.imageURL} alt="img" />
          {this.state.evaluation.map(e => (
            <p>
              {e.name}: <i>{e.confidence}</i>
            </p>
          ))}
        </form>
        <InstantSearch
          appId="EQJPKC2WRW"
          apiKey="5b04b1e3177d8269cf7c95e282d3b81b"
          indexName="items"
        >
          <SearchBox />
          <Hits hitComponent={Product} />
        </InstantSearch>
      </>
    );
  }
}


function Product({ hit }) {
  return <img src={hit.image} alt={hit.title} />;
}


export default Main;
