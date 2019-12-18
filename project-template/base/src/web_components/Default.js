import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {find} from 'lodash';
// import {Container} from 'bqs';

// const {Content, Body} = Container;

// @connect(({admin}, props) => ({
//     defaultPage: find(admin.products, {type: admin.productSelected}).defaultPage,
//     ...props
// }))

export default class extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // let {defaultPage} = this.props;
        // // 当基础信息页也无权限时，防止死循环
        // if (defaultPage === window.location.pathname) {
        //     return (
        //         // <Container>
        //             // <Body>
        //             <p>当前页面无权限访问</p>
        //             // </Body>
        //         // {/* </Container> */}
        //     )
        // }
        // return (
        //     <Redirect to={defaultPage}/>
        // );
        return (
            <div>test</div>
        )
    }
}
