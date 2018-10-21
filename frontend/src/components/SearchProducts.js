import React, { Component } from "react";
import { InstantSearch, Hits, SearchBox, Pagination } from 'react-instantsearch-dom';
import { Card, Icon, Badge } from 'antd';
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
                    <Pagination />
                </InstantSearch>
            </>
        );
    }
}

function Product({ hit }) {
    const keywordBadges = hit.keywords.slice(0, 7).map(k => {
        if (k !== 'no person') {
            return <Badge count={k} key={k} style={{ color: '#111', backgroundColor: '#EEE', margin: '2px' }}></Badge>
        } else {
            return <div key={k}></div>
        }
    })
    return (
        <Card
            style={{ width: 300, maxWidth: '100%' }}
            cover={
                <div style={{ height: 250, overflow: 'hidden' }}>
                    <img alt={hit.title} width={300} src={hit.image} />
                </div>
            }
            actions={[
                <a
                    download
                    rel="noopener noreferrer"
                    target="_blank"
                    key="download"
                    href={hit.image}>
                    <Icon type="download" /> Download
                </a>
            ]}>
            <Meta
                title={hit.title}
                description={keywordBadges}
            />
        </Card >
    )
}

export default SearchProduct;
