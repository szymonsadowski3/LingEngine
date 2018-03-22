import React from 'react';
import 'assets/scss/LingApp.scss';
import Nav from './layout/stateless-helpers/nav';
import HeaderSection from './layout/stateless-helpers/header-section';
import UiContainer from './layout/ui-container/ui-container';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class LingApp extends React.Component {
    render() {
        return (
            <div className="app">
                <Nav/>
                <HeaderSection />
                <hr/>
                <UiContainer></UiContainer>
            </div>
        );
    }
}

export default LingApp;
