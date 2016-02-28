import React from "react";
import {connect} from 'react-redux';
import hashHistory from 'react-router/lib/hashHistory';
import AppBar from 'material-ui/lib/app-bar';
import LeftNav from 'material-ui/lib/left-nav';
import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Subheader from 'material-ui/lib/Subheader/Subheader';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);
import {MD, closeMenu, toggleMenu, loadDoc, loadDocs, deleteDocs,
        storeDoc, changeField, selectRow} from './actions';
import {HeaderActions, AppbarActions} from './action-buttons';

export const DocumentManager = connect(s=>s)(React.createClass({
    propTypes: {
        formview: React.PropTypes.object,
        listview: React.PropTypes.object,
        menu: React.PropTypes.object,
        children: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object,
        dispatch: React.PropTypes.func,
    },
    onMenuItemClick() {
        if (this.props.menu.open && window.innerWidth < MD)
            this.props.dispatch(closeMenu());
        hashHistory.push('/bo/contact/list'); //FIXME contact
    },
    onDelete() {
        this.props.dispatch(deleteDocs(this.props.listview.selectedUuids));
    },
    onChangeView(model, view, uuid='') {
        hashHistory.push(`/bo/${model}/${view}/${uuid}`);
    },
    onRead(uuid) {
        this.props.dispatch(loadDoc(uuid));
    },
    onStore() {
        this.props.dispatch(storeDoc(this.props.formview.data));
        const model = this.props.params.model;
        hashHistory.push(`/bo/${model}/list`);
    },
    onSearch() {
        if (!this.props.listview.docs.length) this.props.dispatch(loadDocs('docs'));
    },
    render() {
        console.log('render: DocumentManager');
        const {formview, listview, params, menu} = this.props;
        const menushadow = `0px 3px 1px rgba(0, 0, 0, 0.16), 0px 3px 1px rgba(0, 0, 0, 0.23)`;
        return (<div style={{paddingTop: '51px'}}>
            <AppBar
                title="Contacts"
                className="row"
                style={{margin: 0, zIndex: 1100, height: '64px', background: '#666', position: 'fixed', top: 0}}
                zDepth={0}
                onLeftIconButtonTouchTap={()=>this.props.dispatch(toggleMenu())} 
                iconElementRight={
                    <AppbarActions
                        view={this.props.location.pathname.split('/')[3]}
                        selectedUuids={this.props.listview.selectedUuids}
                        onDelete={this.onDelete}/>}
            />
            <LeftNav
                ref="leftnav"
                open={menu.open}
                docked={menu.floating?false:true}
                onRequestChange={()=>this.props.dispatch(closeMenu())}
                zDepth={menu.floating ? 3 : 0}
                containerStyle={{
                    boxShadow: menu.floating ? undefined : menushadow,
                    marginTop: '64px'}}>
                <SelectableList
                    valueLink={{
                        value: this.props.location.pathname,
                        requestChange: this.handleRequestChangeList,
                        }}>
                <Subheader><span>Logo</span></Subheader>
                <ListItem primaryText="Contacts" value="/bo/contact/list" onClick={this.onMenuItemClick}/>
                </SelectableList>
            </LeftNav>
            <div style={{
                    paddingLeft: (window.innerWidth > MD && menu.open) ? '256px' : '0',
                    transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
            <div className="row bottom-xs between-lg"
                 style={{height: '60px', margin: '0', zIndex: -5}}>
                <HeaderActions
                    onDelete={this.onDelete}
                    selectedUuids={this.props.listview.selectedUuids}
                    view={this.props.location.pathname.split('/')[3]}
                    createLink={`/bo/${params.model}/new`}/>
            </div>
            {React.cloneElement(this.props.children, {
                formview,
                listview,
                onChangeField: (e)=>this.props.dispatch(changeField(e.target)),
                initialfocus: 'name', // FIXME
                onStore: this.onStore,
                onRead: this.onRead,
                onChangeView: this.onChangeView,
                onRowSelection: (row)=>this.props.dispatch(selectRow(row)),
                onSearch: this.onSearch,
                })}
            </div>
        </div>);
    }
}));
