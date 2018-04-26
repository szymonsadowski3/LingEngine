import React from 'react';

const TransitionMapInfoInModal = ({format, example}) => {
    return <div className="transition-info-wrapper">
        <h1 className="mt-4">Transition Map JSON structure</h1>
        <p>Transition Map should be defined as JSON of given structure:</p>
        <pre className="ml-5">
            {format}
                        </pre>
        <p>For example:</p>
        <pre className="ml-5">
            {example}
                        </pre>
    </div>
};

export default TransitionMapInfoInModal;