import React from "react";
import {connect} from 'react-redux';
import {loadDoc, loadDocs, deleteDocs, storeDoc, changeField, selectRow} from './actions';
import {HeaderActions} from './action-buttons';
import hashHistory from 'react-router/lib/hashHistory';

const mapStateToProps = function(state) {
    // Here we can apply filters to the list if needed
    return {
        formview: state.formview,
        docs: state.listview.docs,
        listStatus: state.listview.listStatus,
        docStatus: state.listview.docStatus,
        selectedUuids: state.listview.selectedUuids,
    }
}

export const DocumentManager = connect(mapStateToProps)(React.createClass({
    propTypes: {
        leftoffset: React.PropTypes.bool,
        formview: React.PropTypes.object,
        docs: React.PropTypes.array,
        selectedUuids: React.PropTypes.array,
        children: React.PropTypes.object,
        listStatus: React.PropTypes.string,
        docStatus: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        onDelete: React.PropTypes.func,
    },
    onDelete() {
        this.props.dispatch(deleteDocs(this.props.selectedUuids));
    },
    onChangeView(model, view, uuid='') {
        console.log('onChangeView', model, view, uuid);
        hashHistory.push(`/bo/${model}/${view}/${uuid}`);
    },
    onRead(uuid) {
        this.props.dispatch(loadDoc(uuid));
    },
    onStore() {
        const doc = this.props.formview.data;
        this.props.dispatch(storeDoc(doc));
        const model = this.props.params.model;
        hashHistory.push(`/bo/${model}/list`);
    },
    onSearch() {
        if (!this.props.docs.length) this.props.dispatch(loadDocs('docs'));
    },
    onChangeField(event) {
        this.props.dispatch(changeField(event.target));
    },
    onRowSelection(row) {
        this.props.dispatch(selectRow(row));
    },
    render() {
        console.log('render: DocumentManager');
        const {formview, docs, listStatus, leftoffset, docStatus, params} = this.props;
        return (
        <div style={{
                paddingLeft: leftoffset ? '256px' : '0',
                transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
            <div className="row bottom-xs between-lg"
                 style={{height: '60px', margin: '0', zIndex: -5}}>
                <HeaderActions
                    onDelete={this.onDelete}
                    selectedUuids={this.props.selectedUuids}
                    view={this.props.location.pathname.split('/')[3]}
                    createLink={`/bo/${params.model}/new`}/>
            </div>
            {React.cloneElement(this.props.children, {
                formview,
                docs,
                listStatus,
                docStatus,
                onChangeField: this.onChangeField,
                initialfocus: 'name',
                onStore: this.onStore,
                onDelete: this.onDelete,
                onRead: this.onRead,
                onChangeView: this.onChangeView,
                onRowSelection: this.onRowSelection,
                selectedUuids: this.props.selectedUuids,
                onSearch: this.onSearch,
                })}
        </div>)
    }
}));
