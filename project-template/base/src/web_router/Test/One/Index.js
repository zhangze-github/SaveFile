// import React, { Component } from 'react';
// import { Provider, connect } from 'react-redux';
// import  style  from './one.css';


// function mapStateToProps(state) {  //将state映射到props
//     return {
//         value: state.test
//     }
// }

// // 见名知意 将 fun 映射到 props
// function mapDispatchToProps(dispatch) {
//     return {
//         onAdd: () => dispatch({ type: 'add' }),
//         onLess: () => dispatch({ type: 'less' }),
//     }
// }

// @connect(mapStateToProps, mapDispatchToProps)

// export default class extends Component {    
//     constructor(props) {
//         super(props);
//         this.state = {
//             a: "test",
//             b: 1
//         }
//     }
//     componentDidMount(){
//         console.warn('One');
//     }
//     render() {
//         const { value, onAdd, onLess } = this.props;
//         console.warn('render');
//         return (
//             <div>
//                 <div className={"wrapper"}>{this.props.value.num}</div>
//                 <button onClick={onAdd}>add</button><br />
//                 <button onClick={onLess}>less</button>
//             </div>
//         )
//     }
// }




import React, { Component, Fragment } from 'react';
import styles from './one.less';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import text from './one.md';


export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Fragment>
                {/*<ReactMarkdown*/}
                {/*    source={text}*/}
                {/*    break*/}
                {/*/>*/}
                <div>one</div>
            </Fragment>
        );
    }
}
