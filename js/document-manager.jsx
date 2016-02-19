import React from "react";
import {ListView} from "./listview";
import {FormView} from "./formview";
import {NotFound} from './notfound';
import {connect} from 'react-redux';
import {deleteDoc, changeView, storeDoc, changeField} from './actions';
import {initialState} from './reducers';

const mapStateToProps = function(state) {
    return state; // Here we can apply filters to the list if needed
}

export const DocumentManager = connect(mapStateToProps)(React.createClass({
    propTypes: {
        route: React.PropTypes.object,
        state: React.PropTypes.object,
        leftoffset: React.PropTypes.string,
        dispatch: React.PropTypes.func,
    },
    onDelete: function(doc) {
        this.props.dispatch(deleteDoc(doc))
    },
    onStore: function() {
        const doc = this.props.state.form.data;
        this.props.dispatch(storeDoc(doc));
        this.changeView('list');
    },
    onChangeField(event) {
        this.props.dispatch(changeField(event.target));
    },
    changeView: function(view) {
        this.props.dispatch(changeView(this.props.route, view));
    },
    child: function(state, route) {
        const {segments, current} = route;
        const doctype = segments[current];
        const view = segments[current+1] || initialState.view;
        const childroute = {...route, current: current+1};
        if (!doctype) {
            return (''); // TODO Dashboard
        } else {
            switch(view) { // TODO make it pluggable
                case 'list':
                    return (<ListView
                        route={childroute}
                        docs={state.docs}
                        onDelete={this.onDelete}
                        changeView={this.changeView}/>);
                case 'new':
                    return (<FormView
                        route={childroute}
                        form={state.form}
                        onStore={this.onStore}
                        initialfocus='name'
                        onChangeField={this.onChangeField}
                        changeView={this.changeView}/>);
                case 'view':
                    return (<FormView
                        route={childroute}
                        form={state.form}
                        onStore={this.onStore}
                        initialfocus='name'
                        onChangeField={this.onChangeField}
                        changeView={this.changeView}/>);
                default:
                    return (<NotFound route={childroute}/>);
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
                    margin: '1em',
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
            {this.child(state, route)}
        </div>)
    }
}));
