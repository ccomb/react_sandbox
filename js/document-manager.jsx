import React from "react";
import {connect} from 'react-redux';
import {loadDoc, loadDocs, deleteDoc, storeDoc, changeField, selectedRows} from './actions';
import {routeActions} from 'react-router-redux';
import {ActionButtons} from './action-buttons';

const mapStateToProps = function(state) {
    // Here we can apply filters to the list if needed
    return {
        form: state.form,
        docs: state.docs,
        status: state.status,
        selectedRows: state.selectedRows,
    }
}

export const DocumentManager = connect(mapStateToProps)(React.createClass({
    propTypes: {
        leftoffset: React.PropTypes.bool,
        form: React.PropTypes.object,
        docs: React.PropTypes.array,
        selectedRows: React.PropTypes.array,
        children: React.PropTypes.object,
        status: React.PropTypes.object,
        params: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        onDelete: React.PropTypes.func,
    },
    onDelete() {
        const doc = this.props.docs[this.props.selectedRows];
        this.props.dispatch(deleteDoc(doc));
        this.props.dispatch(selectedRows([]));
    },
    onChangeView(model, view, uuid='') {
        console.log('onChangeView', model, view, uuid);
        this.props.dispatch(routeActions.push(`/bo/${model}/${view}/${uuid}`));
    },
    onRead(uuid) {
        this.props.dispatch(loadDoc(uuid));
    },
    onStore() {
        const doc = this.props.form.data;
        this.props.dispatch(storeDoc(doc));
        const model = this.props.params.model;
        this.props.dispatch(routeActions.push(`/bo/${model}/list`));
    },
    onSearch() {
        if (!this.props.docs.length) this.props.dispatch(loadDocs('docs'));
    },
    onChangeField(event) {
        this.props.dispatch(changeField(event.target));
    },
    onRowSelection(rows) {
        this.props.dispatch(selectedRows(rows));
    },
    render() {
        console.log('render: DocumentManager', this.props.selectedRows); //FIXME
        const {form, docs, status, leftoffset, params} = this.props;
        return (
        <div style={{
                paddingLeft: leftoffset ? '256px' : '0',
                transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
            <div className="row bottom-xs between-lg"
                 style={{height: '100px', margin: '0', zIndex: -5}}>
                <ActionButtons
                    onDelete={this.onDelete}
                    selectedRows={this.props.selectedRows}
                    createLink={`/bo/${params.model}/new`}/>
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
                onRowSelection: this.onRowSelection,
                selectedRows: this.props.selectedRows,
                onSearch: this.onSearch,
                })}
        </div>)
    }
}));
