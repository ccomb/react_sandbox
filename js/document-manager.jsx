import React from "react";
import {connect} from 'react-redux';
import hashHistory from 'react-router/lib/hashHistory';
import Link from 'react-router/lib/Link';
import AppBar from 'material-ui/lib/AppBar';
import IconButton from 'material-ui/lib/IconButton';
import NavigationApps from 'material-ui/lib/svg-icons/navigation/apps';
import Drawer from 'material-ui/lib/Drawer';
import ListItem from 'material-ui/lib/List/ListItem';
import List from 'material-ui/lib/List';
import Subheader from 'material-ui/lib/Subheader';
import {ListView} from './listview/listview';
import {toggleSelectRow, loadDocs, deleteDocs} from './listview/actions';
import {FormView} from './formview/formview';
import {loadDoc, storeDoc, loadLayouts} from './formview/actions';
import {MakeSelectable} from 'material-ui/lib/List/MakeSelectable';
const SelectableList = MakeSelectable(List);
import {openMenu, closeMenu, toggleSelectColumn} from './actions';
import {HeaderActions, AppBarRightElement, AppBarLeftElement} from './action-buttons';

const VIEWS = {
    'list': connect(state=>({
        docs: state.docs,
        loading: state.loading,
        selection: state.selection,
        allowSelection: state.allowSelection
    }))(ListView),
    'form': connect((state, ownProps)=>({
        doc: state.doc,
        layouts: state.layouts[ownProps.model],
    }))(FormView),
    'new': connect((state, ownProps)=>({
        layouts: state.layouts[ownProps.model],
    }))(FormView),
}

export const DocumentManager = connect(s=>s)(React.createClass({
    propTypes: {
        doc: React.PropTypes.object,
        docs: React.PropTypes.object,
        selection: React.PropTypes.array,
        allowSelection: React.PropTypes.bool,
        menu: React.PropTypes.object,
        layouts: React.PropTypes.object,
        children: React.PropTypes.object,
        params: React.PropTypes.object,
        location: React.PropTypes.object,
        dispatch: React.PropTypes.func,
        onRowClick: React.PropTypes.func,
        device: React.PropTypes.string,
    },
    onMenuItemClick() {
        if (this.props.menu.open && device !== 'laptop')
            this.props.dispatch(closeMenu());
        const {model} = this.props.params;
        this.loadLayouts(); // might be better to have a changeHash action with loadLayouts inside
        hashHistory.push(`/bo/${model}/list`);
    },
    onDelete() {
        this.props.dispatch(deleteDocs(this.props.selection));
        this.props.selection.forEach(u=>this.props.dispatch(toggleSelectColumn(u)));
    },
    changeView(model, view, uuid='') {
        if (['form', 'new'].indexOf(view)>=0) this.loadLayouts();
        hashHistory.push(`/bo/${model}/${view}/${uuid}`);
    },
    storeDoc() {
        const {model} = this.props.params;
        this.props.dispatch(storeDoc(model, this.props.doc));
        hashHistory.push(`/bo/${model}/list`);
    },
    onSearch() {
        const {model} = this.props.params;
        if (!this.props.docs.size) this.props.dispatch(loadDocs(model));
    },
    onCancel() {
        this.changeView(this.props.params.model, 'list');
    },
    onLeftNavChange(open) {
        if (open) this.props.dispatch(openMenu())
        else this.props.dispatch(closeMenu());
    },
    onRowClick(uuid) {
            // enter the record on row click
            this.changeView(this.props.params.model, 'form', uuid);
    },
    onRowSelection(uuid) {
        this.props.dispatch(toggleSelectRow(uuid))
    },
    loadLayouts() {
        const {model} = this.props.params;
        this.props.dispatch(loadLayouts(model));
    },
    loadDoc() {
        const {uuid} = this.props.params;
        if (uuid) this.props.dispatch(loadDoc(uuid));
    },
    render() {
        console.log('render: DocumentManager');
        const {device, dispatch, selection, allowSelection, params, menu, location, layouts} = this.props;
        const {model, view, uuid} = params;
        const menushadow = `0px 3px 1px rgba(0, 0, 0, 0.16), 0px 3px 1px rgba(0, 0, 0, 0.23)`;
        const viewprops =
            view === 'list' ?
            {onRowClick: this.onRowClick, onRowSelection: this.onRowSelection, onSearch: this.onSearch}
            : view === 'form' ?
            {loadDoc: this.loadDoc, onSubmit: this.storeDoc, onChangeField: this.onChangeField, layouts: layouts,
             loadLayouts: this.loadLayouts, onLayoutChange: this.onLayoutChange, initialFocus: 'name'}
            : view === 'new' ?
            {onSubmit: this.storeDoc, onChangeField: this.onChangeField, loadLayouts: this.loadLayouts,
             layouts: layouts, onLayoutChange: this.onLayoutChange, initialFocus: 'name'}
            : {};
        return (<div style={{paddingTop: '51px'}}>
            <AppBar
                title="Contacts"
                className="row"
                style={{margin: 0, height: '64px', background: '#666', position: 'fixed', top: 0}}
                zDepth={0}
                iconElementLeft={
                    <AppBarLeftElement
                        device={device}
                        dispatch={dispatch}
                        menuOpen={menu.open}
                        view={view}
                        onCancel={this.onCancel}/>
                }
                iconElementRight={
                    <div>
                        <Link to="/">
                            <IconButton>
                                <NavigationApps color='white'/>
                            </IconButton>
                        </Link>
                        <AppBarRightElement
                            device={device}
                            view={view}
                            selection={selection}
                            selectColumn={allowSelection}
                            onToggleSelectColumn={()=>dispatch(toggleSelectColumn())}
                            onSubmit={this.storeDoc}
                            onCancel={this.onCancel}
                            onDelete={this.onDelete}/>
                    </div>}
            />
            <Drawer
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
            </Drawer>
            <div style={{
                    paddingLeft: (device === 'laptop' && menu.open) ? '256px' : '0',
                    transition: 'padding-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}}>
            <div className="row bottom-xs between-lg"
                 style={{height: '60px', margin: '0', zIndex: -5}}>
                <HeaderActions
                    onDelete={this.onDelete}
                    onSubmit={this.storeDoc}
                    onCancel={this.onCancel}
                    selection={selection}
                    view={view}
                    device={device}
                    createLink={`/bo/${model}/new`}/>
            </div>
            {React.createElement(VIEWS[view], {...viewprops, device, model, view, uuid})}
            </div>
        </div>);
    }
}));
