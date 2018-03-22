import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import App from '../src/components/LingApp';

it('LingEngineUiApp is rendered', () => {
    // Render LingEngineUiApp in the document
    const appElement = TestUtils.renderIntoDocument(
        <App/>
    );

    const appNode = ReactDOM.findDOMNode(appElement);

    // Verify text content
    expect(appNode.textContent).toEqual('Hello World!Foo to the bar');
});
