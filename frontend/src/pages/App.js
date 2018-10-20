import React, { Component } from "react";
import HomeComponent from '../components/HomeComponent'
import UploadProduct from '../components/UploadProduct'
import SearchProducts from '../components/SearchProducts'
// import "./App.css";

import { Layout, Menu, Icon, Upload } from 'antd';
const { Header, Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      selectedComponent: <HomeComponent />
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }

  handleMenuClick = (event) => {
    let toRender;
    switch (event.key) {
      case "1":
        toRender = <HomeComponent />
        break;
      case "2":
        toRender = <SearchProducts />
        break;
      case "3":
        toRender = <UploadProduct />
        break;
      default:
        toRender = <h1>Error</h1>
        break;
    }
    this.setState({ selectedComponent: toRender });
  }

  render() {
    const toggler = (
      < Icon
        className="trigger"
        type={this.state.collapsed ? 'right' : 'left'}
        style={{ width: '100%' }}
        onClick={this.toggle}
      />
    )
    return (
      <>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            trigger={toggler}
            collapsible
            collapsed={this.state.collapsed}>
            {/* <h1 style={{ textAlign: 'center', color: '#eee', paddingTop: '15px' }}>Online Store</h1> */}
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.handleMenuClick}>
              <Menu.Item key="1">
                <Icon type="home" />
                <span>Home</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="search" />
                <span>Buy</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="shopping" />
                <span>Sell</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              {this.state.selectedComponent}
            </Content>
          </Layout>
        </Layout>
      </>
    );
  }
}


export default Main;
