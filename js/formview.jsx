import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import {SchemaForm} from "./schemaform";
import {schema} from "./schema";
import Paper from 'material-ui/lib/paper';
import FIELDS from './fields';


export const FormView = React.createClass({
    displayName: 'FormView',
    propTypes: {
        doc: React.PropTypes.object,
        onSubmit: React.PropTypes.func,
        onStore: React.PropTypes.func,
        onChangeField: React.PropTypes.func,
        changeView: React.PropTypes.func,
        route: React.PropTypes.object,
        initialfocus: React.PropTypes.string,
    },
    onCancel: function(e) {
        e.preventDefault();
        this.props.changeView('list');
    },
    onSubmit: function(e) {
        e.preventDefault();
        this.props.onStore();
    },
    getInitialState: function() {
        return { shouldfocus: this.props.initialfocus }
    },
    onChangeField: function(event) {
        this.props.onChangeField(event);
    },
    widgetDidMount: function(input) {
        if (input != null && ['text', 'password'].indexOf(input.props.type)+1
            && this.state.shouldfocus == input.props.name){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
    },
    getData: function() {
    },
    render: function() {
        const Field = FIELDS[schema.type];
        const data = this.getData();
        return (
      <div className="row center-sm" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
            <Field
                {...this.props}
                onSubmit={this.onSubmit}
                schema={schema}
                onChangeField={this.onChangeField}
                widgetDidMount={this.widgetDidMount}
                />
                <FlatButton
                    label="Save"
                    onClick={this.onSubmit}
                    primary={true}/>
                <FlatButton
                    label="Cancel"
                    onClick={this.onCancel}
                    cancel={true}/>
            </form>
          </Paper>
        </div>
      </div>);
    }
});


