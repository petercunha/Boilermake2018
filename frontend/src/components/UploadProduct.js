import React, { Component } from "react";
import { Upload, Icon, Button, Input, Row, Col, InputNumber } from "antd";
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
      evaluation: [],
      productSent: false,
      loading: false,
      titleValue: "",
      priceValue: ""
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
  async handleUploadImage(file, fileName) {
    const fileBinary = await this.convertImageToBSONBinaryObject(file);
    const aws = this.stitchClient.getServiceClient(
      AwsServiceClient.factory,
      "zbay-bucket"
    );
    const key = `${this.stitchClient.auth.user.id}-${fileName}`;
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

    if (this.state.imageURL === "") {
      const data = new FormData();
      data.append("url", url);
      data.append("filename", fileName);
      data.append("title", this.state.titleValue);
      data.append("price", this.state.priceValue);
      fetch("http://localhost:8000/upload", {
        method: "POST",
        body: data
      }).then(response => {
        response.json().then(body => {
          this.setState({
            imageURL: body.file,
            evaluation: body.evaluation,
            loading: false
          });
        });
      });
    }
  }

  handleChange = info => {
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      this.handleUploadImage(info.file.originFileObj, info.file.name);
      return;
    }
  };

  handleTitleChange(event) {
    this.setState({ titleValue: event.target.value });
  }

  handlePriceChange(event) {
    this.setState({ priceValue: event.target.value });
  }

  render() {
    const imageUrl = this.state.imageURL;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? "loading" : "plus"} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <>
        <Row>
          <Col span={20}>
            <Input
              value={this.state.titleValue}
              defaultValue={this.state.titleValue}
              onChange={this.handleTitleChange.bind(this)}
              addonBefore="Title"
              placeholder="Name your product"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={20}>
            <Input
              value={this.state.priceValue}
              defaultValue={this.state.priceValue}
              onChange={this.handlePriceChange.bind(this)}
              addonBefore="$"
              placeholder="0.00"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
          </Col>
        </Row>
        <br />
        <Button onClick={this.handleUploadImage}>Submit</Button>
      </>
    );
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default UploadProduct;
