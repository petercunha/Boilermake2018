import React, { Component } from "react";
import { Stitch, AnonymousCredential } from "mongodb-stitch-browser-sdk";
import {
  AwsRequest,
  AwsServiceClient
} from "mongodb-stitch-browser-services-aws";
class UploadProduct extends Component {
  constructor(props) {
    super(props);
    this.stitchClient = Stitch.initializeDefaultAppClient("zbay-thbww");
    this.stitchClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then(user => {
        console.log(user);
      });
    this.state = {
      imageURL: "",
      evaluation: []
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  convertImageToBSONBinaryObject(file) {
    return new Promise(resolve => {
      var fileReader = new FileReader();
      fileReader.onload = event => {
        resolve({
          $binary: {
            base64: event.target.result.split(",")[1],
            subType: "00"
          }
        });
      };
      fileReader.readAsDataURL(file);
    });
  }

  async handleUploadImage(ev) {
    ev.preventDefault();
    const file = ev.target.img.files[0];
    const filename = ev.target.fileName.value;

    if (!file) {
      console.error("handleUploadImage error");
      return;
    }
    // Process the image file
    const fileBinary = await this.convertImageToBSONBinaryObject(file);
    // Upload the image binary to S3
    const aws = this.stitchClient.getServiceClient(
      AwsServiceClient.factory,
      "zbay-bucket"
    );
    const key = `${this.stitchClient.auth.user.id}-${filename}`;
    const bucket = "zbay-bucket";
    const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`;

    const request = new AwsRequest.Builder()
      .withService("s3")
      .withAction("PutObject")
      .withRegion("us-east-1")
      .withArgs({
        ACL: "public-read",
        Bucket: bucket,
        ContentType: file.type,
        Key: key,
        Body: fileBinary
      });
    try {
      await aws.execute(request.build()).then(result => {
        console.log(result);
        console.log(url);
      });
    } catch (e) {
      console.log(e);
    }

    // const data = new FormData();
    // data.append("file", ev.target.img.files[0]);
    // data.append("filename", ev.target.fileName);
    // fetch("http://localhost:8000/upload", {
    //   method: "POST",
    //   body: data
    // }).then(response => {
    //   response.json().then(body => {
    //     this.setState({
    //       imageURL: body.file,
    //       evaluation: body.evaluation
    //     });
    //   });
    // });
  }

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
      </>
    );
  }
}

export default UploadProduct;
