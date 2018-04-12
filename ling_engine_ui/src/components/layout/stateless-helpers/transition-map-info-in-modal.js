import React from 'react';

const TransitionMapInfoInModal = (props) => {
    return <div className="transition-info-wrapper">
        <h1 className="mt-4">Transition Map JSON structure</h1>
        <p>Transition Map should be defined as JSON of given structure:</p>
        <pre className="ml-5">
                        {`
{
    "[input_state_0]": {
        "[signal_0]": "[some_input_state]",
        "[signal_1]": "[some_input_state]",
        "[signal_2]": "[some_input_state]",
        ...
    },
    "[input_state_1]": {
        "[signal_0]": "[some_input_state]",
        "[signal_1]": "[some_input_state]",
        "[signal_2]": "[some_input_state]",
        ...
    },
    ...
}`
                        }
                        </pre>
        <p>For example:</p>
        <pre className="ml-5">
                            {`
{
    "0": {
        "a": "0",
        "b": "1",
        "c": "0"
    },
    "1": {
        "a": "1",
        "b": "0",
        "c": "1"
    }
}
                            `}
                        </pre>
    </div>
};

export default TransitionMapInfoInModal;