import React from "react";
import {connect} from 'react-redux';
import {loadDoc, loadDocs, deleteDoc, storeDoc, changeField} from './actions';
import {routeActions} from 'react-router-redux';

const mapStateToProps = function(state) {
    // Here we can apply filters to the list if needed
    return {
        form: state.form,
        docs: state.docs,
        status: state.status,
    }
}

export const DocumentManager = connect(mapStateToProps)(React.createClass({
    propTypes: {
        leftoffset: React.PropTypes.bool,
        form: React.PropTypes.object,
        docs: React.PropTypes.array,
        children: React.PropTypes.object,
        status: React.PropTypes.object,
        params: React.PropTypes.object,
        dispatch: React.PropTypes.func,
    },
    onDelete(doc) {
        this.props.dispatch(deleteDoc(doc));
    },
    onChangeView(model, view, uuid='') {
        this.props.dispatch(routeActions.push(`/bo/${model}/${view}/${uuid}`));
    },
    onRead(uuid) {
        this.props.dispatch(loadDoc(uuid));
    },
    onStore() {
        const doc = this.props.form.data;
        this.props.dispatch(storeDoc(doc));
        const model = this.props.params.model
        this.props.dispatch(routeActions.push(`/bo/${model}/list`));
    },
    onSearch() {
        if (!this.props.docs.length) this.props.dispatch(loadDocs('docs'));
    },
    onChangeField(event) {
        this.props.dispatch(changeField(event.target));
    },
    render() {
        console.log('render: DocumentManager');
        const {form, docs, status, leftoffset} = this.props;
        return (
        <div
            style={{
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
            {React.cloneElement(this.props.children, {
                form,
                docs,
                status,
                onChangeField: this.onChangeField,
                initialfocus: 'name',
                onStore: this.onStore,
                onDelete: this.onDelete,
                onRead: this.onRead,
                onChangeView: this.onChangeView,
                onSearch: this.onSearch,
                })}
        </div>)
    }
}));
