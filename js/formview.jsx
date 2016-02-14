import React from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/lib/text-field';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import FlatButton from 'material-ui/lib/flat-button';
import {connect} from 'react-redux';
import {storeContact} from './actions';
import {SchemaForm} from "./schemaform";
import {schema} from "./schema";
import Paper from 'material-ui/lib/paper';


export var FormView = connect(state=>({state}))(React.createClass({
    displayName: 'FormView',
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
      <div className="row center-sm" style={{margin: '1%'}}>
        <div className="col-xs center">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
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
            </form>
          </Paper>
        </div>
      </div>);
    }
}));


