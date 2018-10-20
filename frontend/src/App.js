import React, { Component } from "react";
import logo from "./logo.svg";
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
    data.append("file", this.uploadInput.files[0]);
    data.append("filename", this.fileName.value);

    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: data
    }).then(response => {
      response.json().then(body => {
        this.setState({
          imageURL: `http://localhost:8000/${body.file}`,
          evaluation: body.evaluation
        });
      });
    });
  };

  render() {
    return (
      <form onSubmit={this.handleUploadImage}>
        <div>
          <input
            ref={ref => {
              this.uploadInput = ref;
            }}
            type="file"
          />
        </div>
        <div>
          <input
            ref={ref => {
              this.fileName = ref;
            }}
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
          <p>{e.name}: <i>{e.confidence}</i></p>

        ))}
      </form>
    );
  }
}

export default Main;
