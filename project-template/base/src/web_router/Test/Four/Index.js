import React , {Component} from 'react';

export default class  extends Component{
    constructor(props){
        super(props);
        this.state = {
            a: "test",
            b: 1
        }
    }
    componentDidMount(){
        console.warn('four');
    }
    render (){
        return(
            <div style={{fontSize: 30}}>
                Two test!!!
            </div>
        )
    }
}