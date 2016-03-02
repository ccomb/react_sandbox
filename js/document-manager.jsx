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
import {ListView} from './listview/listview';
import {selectRow, loadDocs, deleteDocs} from './listview/actions';
import {FormView} from './formview/formview';
import {loadDoc, storeDoc} from './formview/actions';
import {SelectableContainerEnhance} from 'material-ui/lib/hoc/selectable-enhance';
const SelectableList = SelectableContainerEnhance(List);
import {MD, openMenu, closeMenu, toggleSelectColumn} from './actions';
import {HeaderActions, AppBarRightElement, AppBarLeftElement} from './action-buttons';

const VIEWS = {
    'list': connect(state=>state.listview)(ListView),
    'form': connect(state=>state.formview)(FormView),
    'new': connect(state=>({...state.formview, data: {payload: {}}}))(FormView),
}

export const DocumentManager = connect(s=>s)(React.createClass({
    propTypes: {
        formview: React.PropTypes.object,
        listview: React.PropTypes.object,
        menu: React.PropTypes.object,
        children: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        onRowClick: React.PropTypes.func,
    },
    onMenuItemClick() {
        if (this.props.menu.open && window.innerWidth < MD)
            this.props.dispatch(closeMenu());
        const {model} = this.props.params;
        hashHistory.push(`/bo/${model}/list`);
    },
    onDelete() {
        this.props.dispatch(deleteDocs(this.props.listview.selectedUuids));
    },
    changeView(model, view, uuid='') {
        hashHistory.push(`/bo/${model}/${view}/${uuid}`);
    },
    storeDoc(model=this.props.params.model) {
        this.props.dispatch(storeDoc(model, this.props.formview.data));
        hashHistory.push(`/bo/${model}/list`);
    },
    onSearch() {
        const {model} = this.props.params;
        if (!this.props.listview.docs.length) this.props.dispatch(loadDocs(model));
    },
    onCancel() {
        this.changeView(this.props.params.model, 'list');
    },
    onLeftNavChange(open) {
        if (open) this.props.dispatch(openMenu())
        else this.props.dispatch(closeMenu());
    },
    onLayoutChange(layout, layouts) {
        //this.storeDoc('layouts', layouts);
        console.log('onLayoutChange')
    },
    onRowClick(row) {
            // enter the record on row click
            this.changeView(this.props.params.model, 'form',
                            this.props.listview.docs[row].uuid);
    },
    onRowSelection(row) {
        this.props.dispatch(selectRow(row))
    },
    loadDoc() {
        const {uuid} = this.props.params;
        if (uuid) this.props.dispatch(loadDoc(uuid));
    },
    render() {
        console.log('render: DocumentManager');
        const {dispatch, listview, params, menu, location} = this.props;
        const {model, view} = params;
        const menushadow = `0px 3px 1px rgba(0, 0, 0, 0.16), 0px 3px 1px rgba(0, 0, 0, 0.23)`;
        const viewprops =
            view === 'list' ?
            {onRowClick: this.onRowClick, onRowSelection: this.onRowSelection, onSearch: this.onSearch}
            : view === 'form' ?
            {onLoad: this.loadDoc, onSubmit: this.storeDoc, onChangeField: this.onChangeField,
             onLayoutChange: this.onLayoutChange, initialFocus: 'name'}
            : view === 'new' ?
            {onSubmit: this.storeDoc, onChangeField: this.onChangeField,
             onLayoutChange: this.onLayoutChange, initialFocus: 'name'}
            : {};
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
                style={{margin: 0, height: '64px', background: '#666', position: 'fixed', top: 0}}
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
                        onSubmit={this.storeDoc}
                        onCancel={this.onCancel}
                        onDelete={this.onDelete}/>}
            />
            <LeftNav
                ref="leftnav"
                open={menu.open}
                docked={menu.floating?false:true}
                onRequestChange={this.onLeftNavChange}
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
                    value={`/bo/${model}/list`}
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
                    onSubmit={this.storeDoc}
                    onCancel={this.onCancel}
                    selectedUuids={listview.selectedUuids}
                    view={view}
                    createLink={`/bo/${params.model}/new`}/>
            </div>
            {React.createElement(VIEWS[view], viewprops)}
            </div>
        </div>);
    }
}));
