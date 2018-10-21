import React, { Component } from "react";
import { Upload, Icon, Button, Input, Row, Col } from "antd";
import { Stitch, AnonymousCredential } from "mongodb-stitch-browser-sdk";
import {
    AwsRequest,
    AwsServiceClient
} from "mongodb-stitch-browser-services-aws";

const stitchClient = Stitch.initializeDefaultAppClient("zbay-thbww");
stitchClient.auth
    .loginWithCredential(new AnonymousCredential())
    .then(user => {
        // console.log(user);
    });

class UploadProduct extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
            evaluation: [],
            productSent: false,
            loading: false,
            file: null,
            buttonText: "Submit",
            titleValue: "",
            priceValue: "",
            warningText: ""
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
        const aws = stitchClient.getServiceClient(
            AwsServiceClient.factory,
            "zbay-bucket"
        );
        const key = `${stitchClient.auth.user.id}-${fileName}`;
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
                // console.log(result);
                // console.log(url);
                this.setState({
                    imageURL: url,
                    loading: false,
                })
            });
        } catch (e) {
            // console.log(e);
            this.setState({
                imageURL: "",
                loading: true,
            })
        }

    }

    handleButtonClick = () => {
        // Make sure the user has given us input
        if (this.state.titleValue === "" ||
            this.file === null) {
            this.setState({ warningText: "Please ensure that you've added a title and image." })
            return
        } else {
            this.setState({ warningText: "" })
        }

        this.setState({ buttonText: "Loading..." })


        const data = new FormData();
        data.append("url", this.state.imageURL);
        data.append("title", this.state.titleValue);
        fetch("/upload", {
            method: "POST",
            body: data
        }).then(response => {
            response.json().then(body => {
                this.setState({
                    imageURL: body.file,
                    evaluation: body.evaluation,
                    loading: false,
                    buttonText: "Image posted!",
                    warningText: (
                        <>
                            <b>Image link: </b>
                            <a href={this.state.imageURL}>{this.state.imageURL}</a>
                            <br />
                            <b>Image attributes: </b>
                            <ul>
                                {body.evaluation.map(e => <li>{e.name}</li>)}
                            </ul>
                        </>
                    )
                });
            });
        });
    };

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
                            placeholder="Name your image"
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
                <Button
                    disabled={this.state.buttonText !== "Submit"}
                    onClick={this.handleButtonClick.bind(this)}>
                    {this.state.buttonText}
                </Button>
                <br /><br />
                <p>{this.state.warningText}</p>
            </>
        );
    }
}

export default UploadProduct;
