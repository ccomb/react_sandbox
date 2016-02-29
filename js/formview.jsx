import React from 'react';
import {schema, layouts} from "./schema";
import Paper from 'material-ui/lib/paper';
import FIELDS from './fields';

export const FormView = React.createClass({
    propTypes: {
        formview: React.PropTypes.object,
        params: React.PropTypes.object,
        onRead: React.PropTypes.func,
        initialfocus: React.PropTypes.string,
        onChangeField: React.PropTypes.func,
    },
    onKeyDown(e) {
        if (e.nativeEvent.keyCode === 13) {
            this.onSubmit(e);
        }
    },
    getInitialState() {
        return {shouldfocus: this.props.initialfocus};
    },
    onChangeField(event) {
        this.props.onChangeField(event);
    },
    componentDidMount() {
        const uuid = this.props.params.uuid;
        if (uuid) this.props.onRead(uuid);
    },
    widgetDidMount(input) {
        if (input != null && ['text', 'password'].indexOf(input.props.type)>=0
            && this.state.shouldfocus == input.props.name){
          this.setState({shouldfocus: undefined})
          input.focus()
        }
    },
    render() {
        console.log('render: FormView');
        const Field = FIELDS[schema.type];
        const {formview} = this.props;
        return (
      <div className="row center-xs" style={{margin: '1%'}}>
        <div className="col-xs">
          <Paper style={{padding: '1em', minWidth: '20em', minHeight: '20em'}} className="box">
            <form>
                <Field
                    onKeyDown={this.onKeyDown}
                    schema={schema}
                    formview={formview}
                    layouts={layouts}
                    onChangeField={this.onChangeField}
                    widgetDidMount={this.widgetDidMount}
                />
            </form>
          </Paper>
        </div>
      </div>);
    }
});
