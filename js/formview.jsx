import React from 'react';
import ReactDOM from 'react-dom';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import FlatButton from 'material-ui/lib/flat-button';
import {connect} from 'react-redux';
import {storeContact} from './actions';
import {SchemaForm} from "./schemaform";
import {schema} from "./schema";


export var ContactForm = connect(state=>({state}))(React.createClass({
    displayName: 'ContactForm',
    propTypes: {
        contact: React.PropTypes.object,
        onSubmit: React.PropTypes.func
    },
    onSubmit: function(e) {
        e.preventDefault()
        var contact = this.props.state.form;
        this.props.dispatch(storeContact(contact))
    },
    render: function() {
        return (
            <form>
            <SchemaForm
                schema={schema}
                formData={{}}
                onChange={()=>console.log("changed")}
                onSubmit={()=>console.log("submit")}
                onError={()=>console.log("errors")} />
                <FlatButton
                    label="Save"
                    onClick={this.onSubmit}
                    primary={true}/>
            </form>);
    }
}));


