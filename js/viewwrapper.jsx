import React from "react";
import {ListView} from "./listview";
import {FormView} from "./formview";
import {connect} from 'react-redux';

export var ViewWrapper = connect(state=>({state}))(React.createClass({
  route: function(path) {
    const segments = path.split('/');
    const doctype = segments[2];
    const view = segments[3];
    if (!doctype) {
        return (''); // TODO Dashboard
    } else {
        switch(view) { // TODO make it pluggable
            case 'list':
                return (<ListView/>);
            case 'new':
                return (<FormView/>);
            default:
                return (<ListView/>);
         }
    }
  },
  render: function() {
    const {state, dispatch, leftoffset, route} = this.props;
    console.log('state.path = '+state.path);
    console.log('this.props.route = '+route);
    var goto= this.route(route);
    return (
    <div
        style={{
            background: '#EEE',
            paddingLeft: leftoffset?'256px':'0',
            transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
        <div
            className="row between-sm"
            style={{
                margin: 0,
                background: "#EEE",
                width: '100%'}}>
            <div className='col-sm-2 start-sm'>
                <div className='box' style={{textAlign: 'center'}}>
                    buttons
                </div>
            </div>
            <div className='col-sm-2 center-sm'>
                <div className='box' style={{textAlign: 'center'}}>
                    actions
                </div>
            </div>
            <div className='col-sm-2 end-md'>
                <div className='box' style={{textAlign: 'center'}}>
                    views
                </div>
            </div>
        </div>
        {goto}
    </div>)
  }
}));
