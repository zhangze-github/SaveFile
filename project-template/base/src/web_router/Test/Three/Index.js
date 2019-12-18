import React, { Component } from 'react';
import { addCount, jianCount, httpReq } from './action';
import {inject} from 'utils/index';
import { bindActionCreators } from 'redux';
import { Button } from 'antd';
import three from './reducer';

// @connect(({ three }) => ({
//     ...three
// }), dispatch => bindActionCreators({
//     addCount,
//     jianCount,
//     httpReq
// }, dispatch))


@inject({three}, ({http}, props) => ({
    ...props,
    ...http
}), dispatch => bindActionCreators({
    addCount,
    jianCount,
    httpReq

}, dispatch))

export default class Three extends Component {
    constructor(props) {
        super(props);
        this.state = {
            a: "test",
            b: 1,
            c: {
                d: 2
            }
        }
    }
    componentDidMount() {
    }

    click = () => {
        this.setState({});
        this.props.httpReq();
    }
    render() {
        // const { count, addCount, onLess } = this.props;
        return (
            <div>
                {/* <div className={"wrapper"} style={{ fontSize: 30 }}>{count}</div>
                <button onClick={addCount.bind(null, 3)} style={{ heigth: 40, width: 40 }}>add</button><br />
                <button onClick={onLess}>less</button>
                <button onClick={this.click} style={{ width: 200, height: 200, backgroundColor: 'yellow' }}>click</button>
                <div className='foot'>test</div>  */}
                <div>
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="dashed">Dashed</Button>
                    <Button type="danger" onClick={this.click} >Danger</Button>
                    <Button type="link">Link</Button>
                </div>,
            </div>
        )
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
