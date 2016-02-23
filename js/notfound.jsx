import React from 'react';
import ArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';
import Home from 'material-ui/lib/svg-icons/action/home';
import Link from 'react-router/lib/Link';

export const NotFound = React.createClass({
    render: function(){
        const currentPath = this.props.location.pathname;
        const parentPath = currentPath.substring(0, -1).substring(0, currentPath.lastIndexOf("/"));
        return (<div className='row center-xs' style={{margin: 0}}>
                    <div className='col-xs-1 col-sm-2 col-md-3'>
                        <h1>Not Found</h1>
                        <div className='row center-xs'>
                            <p className='col'>
                                <Link to={parentPath} className='box' style={{margin: '1em'}}><ArrowBack viewBow='0 0 50 50'/></Link>
                                <Link to='/' className='box' style={{margin: '1em'}}><Home/></Link>
                            </p>
                        </div>
                    </div>
                </div>);
    }
});

