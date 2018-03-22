import React from 'react';
import Graph from 'react-graph-vis';
import { converter } from '../../../utils/transform-from-dfa-to-graph';

import './ui-container.scss';
import 'vis/dist/vis.css';
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

class UiContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            alphabet: [],
            states: [],
            initial: [],
            finals: [],
            transitionMap: {},
        };

        this._handleAlphabetChange = this._handleAlphabetChange.bind(this);
        this._handleStatesChange = this._handleStatesChange.bind(this);
        this._handleInitialChange = this._handleInitialChange.bind(this);
        this._handleFinalsChange = this._handleFinalsChange.bind(this);
    }

    render() {
        const inputTest = {
            alphabet: ["a", "b"],
            states: [0, 1],
            initial: 0,
            finals: [1],
            map: {
                0: {"a": 1, "b": 0},
                1: {"a": 1, "b": 1},
            }
        };

        const result = converter(inputTest);

        const options = {
            layout: {
                hierarchical: true
            },
            edges: {
                color: "#000000"
            }
        };

        const events = {
            select: function(event) {
                const { nodes, edges } = event;
            }
        };

        const _renderMultipleInput = (_parentComponent, _stateKey, _onChange, _inputProps, _className="react-tagsinput") => {
            return <TagsInput
                value={_parentComponent.state[_stateKey]}
                onChange={_onChange}
                inputProps={_inputProps}
                className={_className}
            />;
        };

        return (
            <div className="ui-container-wrapper container">
                <span className="alphabet-label mr-3">Input alphabet</span>
                {
                    _renderMultipleInput(this, 'alphabet', this._handleAlphabetChange, {placeholder: 'Add letter'})
                }

                <hr />
                <span className="states-label mr-3">Input states</span>
                {
                    _renderMultipleInput(this, 'states', this._handleStatesChange, {placeholder: 'Add state'})
                }

                <hr />
                <span className="initial-label mr-3">Input initial state</span>
                {
                    _renderMultipleInput(this, 'initial', this._handleInitialChange, {placeholder: 'Add state'})
                }
                <Graph graph={result} options={options} events={events} />
            </div>
        );
    }

    _handleAlphabetChange(alphabet) {
        this.setState({alphabet})
    }

    _handleStatesChange(states) {
        this.setState({states})
    }

    _handleInitialChange(initial) {
        this.setState({initial})
    }

    _handleFinalsChange(finals) {
        this.setState({finals})
    }
}

export default UiContainer;