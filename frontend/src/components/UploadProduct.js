import React, { Component } from "react";
import { Upload, Icon, Button, Input, Row, Col, InputNumber } from 'antd';

class UploadProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: "",
            evaluation: [],
            loading: false
        };
    }

    handleUploadImage = (file, fileName) => {
        if (this.state.imageURL === "") {
            const data = new FormData();
            data.append("file", file);
            data.append("filename", fileName);
            fetch("http://localhost:8000/upload", {
                method: "POST",
                body: data
            }).then(response => {
                response.json().then(body => {
                    this.setState({
                        imageURL: body.file,
                        evaluation: body.evaluation,
                        loading: false,
                    });
                });
            });
        }
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            this.handleUploadImage(info.file.originFileObj, info.file.name)
            return;
        }
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
                        <Input addonBefore="Title" placeholder="Name your product" />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={20}>
                        <InputNumber placeholder="Price" />
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
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default UploadProduct;
