import React, { Component } from "react";
import { Upload, Icon, Button, Input, Row, Col, InputNumber } from 'antd';

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
    }

    handleUploadImage = () => {
        // Make sure the user has given us input
        if (this.state.titleValue === "" ||
            this.state.priceValue === "" ||
            this.file === null) {
            this.setState({ warningText: "Please ensure that you've added a title, price, and image." })
            return
        } else {
            this.setState({ warningText: "" })
        }

        this.setState({ buttonText: "Loading..." })
        const data = new FormData();
        data.append("file", this.state.file);
        data.append("title", this.state.titleValue)
        data.append("price", this.state.priceValue)
        fetch("http://localhost:8000/upload", {
            method: "POST",
            body: data
        }).then(response => {
            response.json().then(body => {
                this.setState({
                    imageURL: body.file,
                    evaluation: body.evaluation,
                    buttonText: "Product posted!"
                });
            });
        });
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({
                file: info.file.originFileObj,
                loading: true
            });
            setTimeout(() => {
                getBase64(info.file.originFileObj, imageUrl => this.setState({
                    imageURL: imageUrl,
                    loading: false,
                }))
            }, 1000);
            return;
        }
    }

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
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );


        return (
            <>
                <Row>
                    <Col span={20}>
                        <Input value={this.state.titleValue} defaultValue={this.state.titleValue} onChange={this.handleTitleChange.bind(this)} addonBefore="Title" placeholder="Name your product" />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={20}>
                        <Input value={this.state.priceValue} defaultValue={this.state.priceValue} onChange={this.handlePriceChange.bind(this)} addonBefore="$" placeholder="0.00" />
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
                            onChange={this.handleChange}>
                            {imageUrl ? <img src={imageUrl} width="100" alt="avatar" /> : uploadButton}
                        </Upload>
                    </Col>
                </Row>
                <br />
                <Button
                    disabled={this.state.buttonText !== "Submit"}
                    onClick={this.handleUploadImage.bind(this)}>
                    {this.state.buttonText}
                </Button>
                <br /><br />
                <p>{this.state.warningText}</p>
            </>
        );
    }
}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default UploadProduct;
