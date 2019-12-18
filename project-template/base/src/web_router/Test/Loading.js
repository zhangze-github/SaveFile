import React, {Component} from 'react';
import {Spin} from 'antd';

export default class extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div style={{left: '50%', top: '50%', position: 'absolute'}}>
                <Spin size="large" />
            </div>

        )
    }
}