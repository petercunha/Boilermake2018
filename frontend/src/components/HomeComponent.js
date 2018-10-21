import React, { Component } from "react";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ textAlign: 'center', marginTop: '15%' }}>
                <div style={{ display: 'inline-block', maxWidth: '45em' }}>
                    <h1>Optical Search Engine</h1>
                    <div style={{ textAlign: 'left' }}>
                        <p>
                            The Optical Search Engine (OSE) allows you to easily upload photos and search for them later.
                            By using machine learning techniques, we can analyze your image and extract objects, ideas,
                            and themes from them. These attributes are added to a database and make your images searchable!
                            The image recognition API we used is called Clarifai, and the search engine is powered by Algolia.
                        </p>
                        <p>
                            <i>
                                This project was inspired by Google Photos, which allows users to upload and search through their images.
                                Our project is an open source alternative!
                        </i>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}


export default Home;
