import React from 'react';
import 'assets/scss/LingApp.scss';
import Nav from './layout/nav';
import HeaderSection from './layout/header-section';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class LingApp extends React.Component {
    render() {
        return (
            <div className="app">
                <Nav/>
                <HeaderSection />
                <hr/>
                <h1>Ui will be here</h1>
            </div>
        );
    }
}

export default LingApp;
