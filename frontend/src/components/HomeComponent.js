import React, { Component } from "react";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <h1>Welcome to zBay</h1>
                <p>
                    zBay allows you to easily sell anything. Just take a picture, add a title and price,
                    and your product will be instantly available to the entire internet for purchase. We
                    use machine learning technology to identify your image and add relevant search keywords,
                    so customers can easily find and buy your product.
                </p>
            </>
        );
    }
}


export default Home;
