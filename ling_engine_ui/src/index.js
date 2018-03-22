import React from "react";
import ReactDOM from 'react-dom';
import {AppContainer} from "react-hot-loader";
import LingApp from "components/LingApp";

const rootEl = document.getElementById("root");

const renderComponent = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        rootEl
    );
};

renderComponent(LingApp);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept("./components/LingApp", () => {
        renderComponent(LingApp);
    });
}
