import React , {Component} from 'react';
import { Menu, Icon, Divider } from 'antd';

import Slider from './Slider';
import Topbar from './Topbar';
import {BrowserRouter as Router, Route, Redirect, Switch, HashRouter} from 'react-router-dom';
const { SubMenu } = Menu;
import Base from './Base';
import Default from './Default';
import router from '../web_router/index';

export default class Sider extends React.Component {

  render() {
    return (
        <div style={{}}>
            <Topbar></Topbar>
            
        <HashRouter>
            <div style={{position: 'absolute'}}>
                <Slider></Slider>
            </div>
            
            <div style={{marginLeft: 180, paddingTop: 45}}>
                <div style={{margin: 50}}>
                {
                    router.map((item, index) => {
                        return(
                            <Route path={item.path} component={item.component} key={index} />
                        )
                    })
                }
                </div>
            </div>
            
        </HashRouter>
        </div>

    );
  }
}

