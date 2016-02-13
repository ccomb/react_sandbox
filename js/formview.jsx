import React from 'react';
import ReactDOM from 'react-dom';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TextField from 'material-ui/lib/text-field';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
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
        var contact = {
            surname: this.refs.surname.getValue(),
            name: this.refs.name.getValue(),
            email: this.refs.email.getValue(),
            description: this.refs.description.getValue()
        }
        this.props.dispatch(storeContact(contact))
        for (var field of ['surname', 'name', 'email', 'description']) {
            this.refs[field].setValue('');}
    },
    render: function() {
        return (
            <SchemaForm
                schema={schema}
                formData={{}}
                onChange={console.log("changed")}
                onSubmit={console.log("submitted")}
                onError={console.log("errors")} />
            /*<TableRow>
                <TableRowColumn/>
                <TableRowColumn>
                    <TextField id='surname' ref='surname'floatingLabelText='surname'/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField id='name' ref='name'floatingLabelText='name' errorText='required'/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField id='email' ref='email' floatingLabelText='email' errorText='required'/>
                </TableRowColumn>
                <TableRowColumn>
                    <TextField id='description' ref='description' floatingLabelText='description'/>
                </TableRowColumn>
                <TableRowColumn>
                    <FloatingActionButton ref='button' onClick={this.onSubmit} mini={true} zDepth="1">
                        <ContentAdd/>
                    </FloatingActionButton>
                </TableRowColumn>
            </TableRow>*/);
    }
}));


