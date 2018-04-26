import React from 'react';
import Graph from 'react-graph-vis';
import clone from 'lodash/clone';
import get from 'lodash/get';

import axios from 'axios';

import {converter} from '../../../../utils/transform-from-dfa-to-graph';
import {
    exampleStandardTransitionMap, nfaTransitionMapExample, nfaTransitionMapFormat, standardTransitionMapFormat,
    visOptions
} from "../../../../constants/constants-values";

import 'vis/dist/vis.css';
import TagsInput from 'react-tagsinput'
import {JsonEditor as Editor} from 'jsoneditor-react';

import Modal from 'react-awesome-modal';

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/github';

import {nfaToDfaApi} from "../../../../config/api-endpoints";

import JSONPretty from 'react-json-pretty';

import '../../../../../node_modules/react-json-pretty/src/JSONPretty.monikai.css';

import 'jsoneditor-react/es/editor.min.css';
import 'react-tagsinput/react-tagsinput.css'
import './visualization-section.scss';
import TransitionMapInfoInModal from "../../stateless-helpers/transition-map-info-in-modal";

class NfaToDfa extends React.Component {
    constructor() {
        super();

        this.state = {
            alphabet: ["a", "b"],
            states: ["q0", "q1", "q2"],
            initial: ["q0"],
            finals: ["q1"],
            transitionMap: {},
            graphInput: null,
            isModalOpen: false,

            resultingAlphabet: null,
            resultingStates: null,
            resultingInitial: null,
            resultingFinals: null,
            resultingTransitionMap: null
        };

        this._handleAlphabetChange = this._handleAlphabetChange.bind(this);
        this._handleStatesChange = this._handleStatesChange.bind(this);
        this._handleInitialChange = this._handleInitialChange.bind(this);
        this._handleFinalsChange = this._handleFinalsChange.bind(this);
        this._handleTransitionMapChange = this._handleTransitionMapChange.bind(this);
        this._convertToDfa = this._convertToDfa.bind(this);
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
            <div className="nfa-to-dfa container container">
                <Modal visible={this.state.isModalOpen} width="600" effect="fadeInUp"
                       onClickAway={() => this._closeModal()}>
                    <div className="container">
                        <TransitionMapInfoInModal
                            format={nfaTransitionMapFormat}
                            example={nfaTransitionMapExample}
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
                    onClick={this._convertToDfa}>
                    Convert to DFA!
                </button>

                <hr />

                {this.state.alphabet && <dl className="row">
                    <dt className="col-sm-3">Alphabet</dt>
                    <dd className="col-sm-9">{this.state.resultingAlphabet && JSON.stringify(this.state.resultingAlphabet)}</dd>

                    <dt className="col-sm-3">States</dt>
                    <dd className="col-sm-9">{this.state.resultingStates && JSON.stringify(this.state.resultingStates)}</dd>

                    <dt className="col-sm-3">Initial state</dt>
                    <dd className="col-sm-9">{this.state.resultingInitial && JSON.stringify(this.state.resultingInitial)}</dd>


                    <dt className="col-sm-3">Final states</dt>
                    <dd className="col-sm-9">{this.state.resultingFinals && JSON.stringify(this.state.resultingFinals)}</dd>

                    <dt className="col-sm-3">Transition map</dt>
                    <dd className="col-sm-9">
                        {this.state.resultingTransitionMap &&
                        <JSONPretty id="json-pretty" json={this.state.resultingTransitionMap}/>}
                    </dd>
                </dl>}

                <hr />

                {this.state.graphInput &&
                <div className="graph-wrapper">
                    <Graph graph={converter(this.state.graphInput)} options={visOptions} events={events}/>
                </div>}
            </div>
        );
    }

    _generateRequestBody(input) {
        return {
            alphabet: clone(input.alphabet),
            states: clone(input.states),
            initial: clone(input.initial)[0],
            finals: clone(input.finals),
            transitionMap: clone(input.transitionMap),
        }
    }

    _generateGraphInput(input) {
        return {
            alphabet: clone(input.resultingAlphabet),
            states: clone(input.resultingStates),
            initial: clone(input.resultingInitial),
            finals: clone(input.resultingFinals),
            transitionMap: clone(input.resultingTransitionMap),
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

    _convertToDfa() {
        const request = this._generateRequestBody(this.state);
        const component = this;

        axios.post(nfaToDfaApi, request).then(function (response) {
            const stateToSet = {
                resultingTransitionMap: response.data.transitionMap,
                resultingStates: response.data.states,
                resultingInitial: response.data.initial,
                resultingFinals: response.data.finals,
                resultingAlphabet: response.data.alphabet,
            };

            component.setState({
                ...stateToSet,
                graphInput: component._generateGraphInput(stateToSet)
            });
        })
            .catch(function (error) {
                alert('Error while fetchin data!' + error);
            });
    }

    _closeModal() {
        this.setState({isModalOpen: false});
    }

    _openModal() {
        this.setState({isModalOpen: true});
    }
}

export default NfaToDfa;