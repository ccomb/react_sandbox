import React from 'react';
import FlatButton from 'material-ui/lib/flat-button';
import {schema, layouts} from "./schema";
import Paper from 'material-ui/lib/paper';
import FIELDS from './fields';
import Link from 'react-router/lib/Link';

export const FormView = React.createClass({
    propTypes: {
        form: React.PropTypes.object,
        params: React.PropTypes.object,
        onStore: React.PropTypes.func,
        initialfocus: React.PropTypes.string,
        onChangeField: React.PropTypes.func,
    },
    onSubmit(e) {
        e.preventDefault();
        this.props.onStore();
    },
    getInitialState() {
        return { shouldfocus: this.props.initialfocus }
    },
    onChangeField(event) {
        this.props.onChangeField(event);
    },
    widgetDidMount(input) {
        if (input != null && ['text', 'password'].indexOf(input.props.type)+1
            && this.state.shouldfocus == input.props.name){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
    },
    render() {
        console.log('render: FormView');
        const Field = FIELDS[schema.type];
        const {form, params} = this.props;
        return (
      <div className="row center-xs" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
            <Field
                onSubmit={this.onSubmit}
                schema={schema}
                form={form}
                layouts={layouts}
                onChangeField={this.onChangeField}
                widgetDidMount={this.widgetDidMount}
                />
                <FlatButton
                    label="Save"
                    onClick={this.onSubmit}
                    primary={true}/>
                <Link to={`/bo/${params.model}/list`}><FlatButton
                    label="Cancel"
                    cancel={true}/>
                </Link>
            </form>
          </Paper>
        </div>
      </div>);
    }
});
