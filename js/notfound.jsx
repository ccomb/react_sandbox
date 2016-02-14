import React from 'react';
import {connect} from 'react-redux';

export var NotFound = connect(state=>({state}))(React.createClass({

    displayName: 'NotFound',

    render: function(e){
        return (<p><a href='#/bo/contact/list'>Contacts</a></p>);
    }
}));

