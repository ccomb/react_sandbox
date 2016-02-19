import React from 'react';
import FIELDS from './fields';

export var SchemaForm = React.createClass({
    displayName: 'SchemaForm',

    propTypes: {
        schema: React.PropTypes.object,
        onChangeField: React.PropTypes.func,
        widgetDidMount: React.PropTypes.func,
    },
    render: function() {
        const {schema} = this.props;
        const Field = FIELDS[schema.type];
        return <Field
                {...this.props}
                schema={schema}
                onChangeField={this.props.onChangeField}
                widgetDidMount={this.props.widgetDidMount}
                />;
    }
})
