import React from "react";
import {connect} from 'react-redux';
import hashHistory from 'react-router/lib/hashHistory';
import Link from 'react-router/lib/Link';
import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import NavigationApps from 'material-ui/lib/svg-icons/navigation/apps';
import LeftNav from 'material-ui/lib/left-nav';
import ListItem from 'material-ui/lib/lists/list-item';
import List from 'material-ui/lib/lists/list';
import Subheader from 'material-ui/lib/Subheader/Subheader';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);
import {MD, closeMenu, loadDoc, loadDocs, deleteDocs,
        storeDoc, changeField, selectRow, toggleSelectColumn} from './actions';
import {HeaderActions, AppBarRightElement, AppBarLeftElement} from './action-buttons';

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
    onSubmit(e) {
        e.preventDefault();
        this.onStore();
    },
    onCancel() {
        this.onChangeView(this.props.params.model, 'list');
    },
    render() {
        console.log('render: DocumentManager');
        const {formview, dispatch, listview, params, menu, location, children} = this.props;
        const view=location.pathname.split('/')[3];
        const menushadow = `0px 3px 1px rgba(0, 0, 0, 0.16), 0px 3px 1px rgba(0, 0, 0, 0.23)`;
        return (<div style={{paddingTop: '51px'}}>
            {view === 'list' ?
            <Link style={{position: 'fixed', bottom: '1em', left: '1em', zIndex: 5000}}
                  to="/">
                <IconButton>
                    <NavigationApps/>
                </IconButton>
            </Link> : undefined}
            <AppBar
                title="Contacts"
                className="row"
                style={{margin: 0, zIndex: 1100, height: '64px', background: '#666', position: 'fixed', top: 0}}
                zDepth={0}
                iconElementLeft={
                    <AppBarLeftElement
                        dispatch={dispatch}
                        menuOpen={menu.open}
                        view={view}
                        onCancel={this.onCancel}/>
                }
                iconElementRight={
                    <AppBarRightElement
                        view={view}
                        selectedUuids={listview.selectedUuids}
                        selectColumn={listview.selectColumn}
                        onToggleSelectColumn={()=>dispatch(toggleSelectColumn())}
                        onSubmit={this.onSubmit}
                        onCancel={this.onCancel}
                        onDelete={this.onDelete}/>}
            />
            <LeftNav
                ref="leftnav"
                open={menu.open}
                docked={menu.floating?false:true}
                onRequestChange={()=>dispatch(closeMenu())}
                zDepth={menu.floating ? 3 : 0}
                overlayStyle={{marginTop: '64px'}}
                containerStyle={{
                    boxShadow: menu.floating ? undefined : menushadow,
                    marginTop: '64px'}}>
                <SelectableList
                    valueLink={{
                        value: location.pathname,
                        requestChange: this.handleRequestChangeList,
                        }}>
                <Subheader style={{textAlign: 'center'}}>Logo</Subheader>
                <ListItem
                    primaryText="Contacts"
                    value="/bo/contact/list"
                    onClick={this.onMenuItemClick}/>
                </SelectableList>
            </LeftNav>
            <div style={{
                    paddingLeft: (window.innerWidth > MD && menu.open) ? '256px' : '0',
                    transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
            <div className="row bottom-xs between-lg"
                 style={{height: '60px', margin: '0', zIndex: -5}}>
                <HeaderActions
                    onDelete={this.onDelete}
                    onSubmit={this.onStore}
                    onCancel={this.onCancel}
                    selectedUuids={listview.selectedUuids}
                    view={view}
                    createLink={`/bo/${params.model}/new`}/>
            </div>
            {React.cloneElement(children, {
                formview,
                listview,
                onChangeField: (e)=>dispatch(changeField(e.target)),
                initialfocus: 'name', // FIXME
                onRead: this.onRead,
                onChangeView: this.onChangeView,
                onRowSelection: (row)=>dispatch(selectRow(row)),
                onSearch: this.onSearch,
                })}
            </div>
        </div>);
    }
}));
