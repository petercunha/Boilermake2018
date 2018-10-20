import React, { Component } from "react";
import {
    InstantSearch,
    Hits,
    SearchBox
} from 'react-instantsearch-dom';

class SearchProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
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

export default SearchProduct;
