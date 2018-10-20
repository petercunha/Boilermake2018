import React, { Component } from "react";
import { InstantSearch, Hits, SearchBox } from 'react-instantsearch-dom';
import { Card, Icon, Avatar, Row, Col } from 'antd';
import './SearchProducts.css'

const { Meta } = Card

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
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <div style={{ height: 250, overflow: 'hidden' }}>
                    <img alt={hit.title} width={300} src={hit.image} />
                </div>
            }
            actions={[<a><Icon type="shopping-cart" /> Buy now</a>]}>
            <Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={hit.title}
                description={hit.keywords}
            />
        </Card >
    )
}

export default SearchProduct;
