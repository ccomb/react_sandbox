import React from 'react';
import FIELDS from './fields';

export var SchemaForm = React.createClass({
    displayName: 'SchemaForm',
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
