import React from 'react';
import Graph from 'react-graph-vis';
import clone from 'lodash/clone';

import {converter} from '../../../../utils/transform-from-dfa-to-graph';
import {
    exampleStandardTransitionMap, standardTransitionMapFormat,
    visOptions
} from "../../../../constants/constants-values";

import 'vis/dist/vis.css';
import TagsInput from 'react-tagsinput'
import { JsonEditor as Editor } from 'jsoneditor-react';

import Modal from 'react-awesome-modal';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import 'jsoneditor-react/es/editor.min.css';
import 'react-tagsinput/react-tagsinput.css'
import './visualization-section.scss';
import TransitionMapInfoInModal from "../../stateless-helpers/transition-map-info-in-modal";

class VisualisationSection extends React.Component {
    constructor() {
        super();

        this.state = {
            alphabet: ["a", "b", "c"],
            states: [0, 1],
            initial: [0],
            finals: [1],
            transitionMap: {},
            graphInput: null,
            isModalOpen: false,
        };

        this._handleAlphabetChange = this._handleAlphabetChange.bind(this);
        this._handleStatesChange = this._handleStatesChange.bind(this);
        this._handleInitialChange = this._handleInitialChange.bind(this);
        this._handleFinalsChange = this._handleFinalsChange.bind(this);
        this._handleTransitionMapChange = this._handleTransitionMapChange.bind(this);
        this._onVisualize = this._onVisualize.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
    }

    render() {
        const events = {
            select: function (event) {
                const {nodes, edges} = event;
            }
        };

        const _renderMultipleInput = (_parentComponent, _stateKey, _onChange, _inputProps, _className = "react-tagsinput") => {
            return <TagsInput
                value={_parentComponent.state[_stateKey]}
                onChange={_onChange}
                inputProps={_inputProps}
                className={_className}
            />;
        };

        return (
            <div className="visualization-container container visualize-automata">
                <Modal visible={this.state.isModalOpen} width="600" effect="fadeInUp" onClickAway={() => this._closeModal()}>
                    <div className="container">
                        <TransitionMapInfoInModal
                            format={standardTransitionMapFormat}
                            example={exampleStandardTransitionMap}
                        />
                        <button className="btn btn-primary mb-4" onClick={() => this._closeModal()}>Close</button>
                    </div>
                </Modal>

                <span className="alphabet-label mr-3">Input alphabet</span>
                {
                    _renderMultipleInput(this, 'alphabet', this._handleAlphabetChange, {placeholder: 'Add letter'})
                }

                <hr/>
                <span className="states-label mr-3">Input states</span>
                {
                    _renderMultipleInput(this, 'states', this._handleStatesChange, {placeholder: 'Add state'})
                }

                <hr/>
                <span className="initial-label mr-3">Input initial state</span>
                {
                    _renderMultipleInput(this, 'initial', this._handleInitialChange, {placeholder: 'Add initial'})
                }

                <hr/>
                <span className="finals-label mr-3">Input final states</span>
                {
                    _renderMultipleInput(this, 'finals', this._handleFinalsChange, {placeholder: 'Add final'})
                }

                <hr/>
                <span className="transition-map-label d-inline-block mr-3 mb-3">Input transition map</span>

                <button type="button" className="btn btn-primary" onClick={this._openModal}>
                    View more information on transition map structure
                </button>

                <Editor
                    value={this.state.transitionMap}
                    onChange={this._handleTransitionMapChange}
                    ace={ace}
                    theme="ace/theme/github"
                    mode="code"
                />

                <button
                    className="btn btn-success mt-3"
                    onClick={this._onVisualize}>
                    Visualize!
                </button>

                {this.state.graphInput &&
                <div className="graph-wrapper">
                    <Graph graph={converter(this.state.graphInput)} options={visOptions} events={events}/>
                </div>}
            </div>
        );
    }

    _generateGraphInput(state) {
        return {
            alphabet: clone(state.alphabet),
            states: clone(state.states),
            initial: clone(state.initial)[0],
            finals: clone(state.finals),
            transitionMap: clone(state.transitionMap),
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

    _handleTransitionMapChange(parsedMap) {
        this.setState({transitionMap: parsedMap})
    }

    _onVisualize() {
        const generatedOut = this._generateGraphInput(this.state);

        this.setState(
            {
                graphInput: generatedOut
            }
        );
    }

    _closeModal() {
        this.setState({isModalOpen: false});
    }

    _openModal() {
        this.setState({isModalOpen: true});
    }
}

export default VisualisationSection;