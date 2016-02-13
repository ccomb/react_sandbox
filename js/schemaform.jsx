import React from 'react';
import ReactDOM from 'react-dom';
import TextWidget from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';


const WIDGETS = {
    string: TextWidget
}

export var ObjectField = React.createClass({
    displayName: 'ObjectField',
    render: function() {
        const {schema} = this.props;
        var children = [];
        Object.keys(schema.properties).map(function(name) {
                children.push(
                    React.createElement(WIDGETS[schema.properties[name].type] || ObjectField,
                                        {schema: schema.properties[name]}))
            }
        )
        return React.createElement('div', {}, ...children)
    }
})

export var StringField = React.createClass({
    displayName: 'StringField',
    render: function() {
        const {schema} = this.props;
        const Widget = WIDGETS[schema.widget] || TextWidget;
        return (
            <Widget />
        )
    }
})


const FIELDS = {
    object: ObjectField,
    string: StringField
}

export var SchemaForm = React.createClass({
    displayName: 'SchemaForm',
    render: function() {
        const {schema} = this.props;
        const Field = FIELDS[schema.type];
        return (
            <form>
                <Field schema={schema} />
                <FlatButton label="Ok"/>
            </form>
        );
    }
})
