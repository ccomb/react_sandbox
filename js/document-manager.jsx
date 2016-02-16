import React from "react";
import {ListView} from "./listview";
import {FormView} from "./formview";

export const DocumentManager = React.createClass({
  component: function(route) {
    const {segments, current} = route;
    const doctype = segments[current];
    const view = segments[current+1];
    const childroute = {...route, current: current+1};
    if (!doctype) {
        return (''); // TODO Dashboard
    } else {
        switch(view) { // TODO make it pluggable
            case 'list':
                return (<ListView route={childroute}/>);
            case 'new':
                return (<FormView route={childroute} initialfocus='surname'/>);
            default:
                return (<ListView route={childroute}/>);
         }
    }
  },
  render: function() {
    const {state, leftoffset, route} = this.props;
    const background = route.segments[route.current] == 'new' ? '#EEE' : '#FFF';
    return (
    <div
        style={{
            background,
            paddingLeft: leftoffset ? '256px' : '0',
            transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
        <div
            className="row between-lg"
            style={{
                margin: 0,
                width: '100%'}}>
            <div className='col-sm-2'>
                <div className='box' style={{textAlign: 'center'}}>
                    buttons
                </div>
            </div>
            <div className='col-sm-2'>
                <div className='box' style={{textAlign: 'center'}}>
                    actions
                </div>
            </div>
            <div className='col-sm-2'>
                <div className='box' style={{textAlign: 'center'}}>
                    views
                </div>
            </div>
        </div>
        {this.component(route)}
    </div>)
  }
});
