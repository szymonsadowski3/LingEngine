import React from 'react';
import Graph from 'react-graph-vis';
import { converter } from '../../../utils/transform-from-dfa-to-graph';
import clone from 'lodash/clone';

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
            transitionMap: '',
            graphInput: null
        };

        this._handleAlphabetChange = this._handleAlphabetChange.bind(this);
        this._handleStatesChange = this._handleStatesChange.bind(this);
        this._handleInitialChange = this._handleInitialChange.bind(this);
        this._handleFinalsChange = this._handleFinalsChange.bind(this);
        this._handleTransitionMapChange = this._handleTransitionMapChange.bind(this);
    }

    render() {
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
                    _renderMultipleInput(this, 'initial', this._handleInitialChange, {placeholder: 'Add initial'})
                }

                <hr />
                <span className="finals-label mr-3">Input final states</span>
                {
                    _renderMultipleInput(this, 'finals', this._handleFinalsChange, {placeholder: 'Add final'})
                }

                <hr />
                <span className="transition-map-label mr-3">Input transition map</span>
                <textarea value={this.state.transitionMap} onChange={this._handleTransitionMapChange} className="json-area"/>

                <button
                    onClick={() => {
                        const generatedOut = this._generateGraphInput(this.state);
                        console.log(generatedOut);

                        this.setState(
                            {
                                graphInput: generatedOut
                            }
                        );


                        console.log(this.state);
                    }}>
                    Visualize!
                </button>

                {this.state.graphInput && <Graph graph={converter(this.state.graphInput)} options={options} events={events} />}
            </div>
        );
    }

    _generateGraphInput(state) {
        return {
            alphabet: clone(state.alphabet),
            states: clone(state.states),
            initial: clone(state.initial)[0],
            finals: clone(state.finals),
            transitionMap: JSON.parse(state.transitionMap),
        }
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

    _handleTransitionMapChange(event) {
        this.setState({transitionMap: event.target.value})
    }
}

export default UiContainer;