import React from 'react';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import Home from 'material-ui/lib/svg-icons/action/home';

export var NotFound = React.createClass({

    displayName: 'NotFound',

    render: function(e){
        const up = this.props.route.segments.slice(0, -1).join('/');
        const home = this.props.route.segments.slice(0, 2).join('/');
        return (<div className='row center-xs' open={true} title='Page not Found' style={{margin: 0}}>
                    <div className='col-xs-1 col-sm-2 col-md-3'>
                        <h1>Not Found</h1>
                        <p>Current path: {this.props.route.segments.join('/')}</p>
                        <div className='row center-xs'>
                            <p class='col'>
                                <a className='box' style={{margin: '1em'}} href={up}><ArrowBack viewBow='0 0 50 50'/></a>
                                <a className='box' style={{margin: '1em'}} href={home}><Home/></a>
                            </p>
                        </div>
                    </div>
                </div>);
    }
});

