import React from 'react';
import ReactGridLayout from 'react-grid-layout';
import WIDGETS from './widgets';

var ObjectField = React.createClass({
    displayName: 'ObjectField',

    propTypes: {
        name: React.PropTypes.string,
        schema: React.PropTypes.object,
        required: React.PropTypes.bool,
    },

    render: function() {
        const {schema} = this.props;
        var i = 0, self = this;
        const children = Object.keys(schema.properties).map((name) => {
            const Field = FIELDS[schema.properties[name].type];
            return (<div key={name + i++}
                         _grid={{x: 0, y: 2*i, w: 3, h: 1.5}}>
                    <Field
                        {...self.props}
                        name={name}
                        schema={schema.properties[name]}
                        required={schema.required ? schema.required.indexOf(name)+1 : false}/>
                    </div>
            )
        });
        return (
            <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1500}>
            {children}
            </ReactGridLayout>
        )
                
    }
});

const StringField = React.createClass({
    displayName: 'StringField',

    propTypes: {
        name: React.PropTypes.string,
        schema: React.PropTypes.object,
        required: React.PropTypes.bool,
    },

    render: function() {
        const {schema} = this.props;
        const Widget = WIDGETS[schema.subtype] || WIDGETS['string'];
        return (
            <Widget {...this.props} />
        )
    }
})

const FIELDS = {
    object: ObjectField,
    string: StringField
}

export default FIELDS;
