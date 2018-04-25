import React from 'react';
import Graph from 'react-graph-vis';
import clone from 'lodash/clone';

import axios from 'axios';

import {converter} from '../../../../utils/transform-from-dfa-to-graph';
import {visOptions} from "../../../../constants/constants-values";

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

            alphabet2: null,
            states2: null,
            initial2: null,
            finals2: null,
            transitionMap2: null
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
                        <TransitionMapInfoInModal/>
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
                    <dd className="col-sm-9">{JSON.stringify(this.state.alphabet2)}</dd>

                    <dt className="col-sm-3">States</dt>
                    <dd className="col-sm-9">{JSON.stringify(this.state.states2)}</dd>

                    <dt className="col-sm-3">Initial state</dt>
                    <dd className="col-sm-9">{JSON.stringify(this.state.initial2)}</dd>


                    <dt className="col-sm-3">Final states</dt>
                    <dd className="col-sm-9">{JSON.stringify(this.state.finals2)}</dd>

                    <dt className="col-sm-3">Transition map</dt>
                    <dd className="col-sm-9">
                        <JSONPretty id="json-pretty" json={this.state.transitionMap2}/>
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

    _generateGraphInput2(state) {
        return {
            alphabet: clone(state.alphabet2),
            states: clone(state.states2),
            initial: clone(state.initial2)[0],
            finals: clone(state.finals2),
            transitionMap: clone(state.transitionMap2),
        }
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

    _convertToDfa() {
        const request = this._generateGraphInput(this.state);

        const component = this;

        axios.post(nfaToDfaApi, request).then(function (response) {
            component.setState({
                transitionMap2: response.data.transitionMap,
                states2: response.data.states,
                initial2: response.data.initial,
                finals2: response.data.finals,
                alphabet2: response.data.alphabet
            });
        })
            .catch(function (error) {
                alert('Error while fetchin data!');
            });

        this.setState(
            {
                graphInput: this._generateGraphInput2(this.state)
            }
        );
    }

    // _convertToRegex() {
    //     const { alphabet, states, initial, finals, transitionMap } = this.state;
    //
    //     const request = {
    //         alphabet: alphabet,
    //         states: map(states, String),
    //         initial: initial[0].toString(),
    //         finals: map(finals, String),
    //         map: transitionMap,
    //     };
    //
    //     const component = this;
    //
    //     axios.post(dfaToRegexApi, request).then(function (response) {
    //         component.setState({
    //             obtainedRegex: response.data.regex,
    //         });
    //     })
    //         .catch(function (error) {
    //             alert('Error while fetchin data!');
    //         });
    // }

    _closeModal() {
        this.setState({isModalOpen: false});
    }

    _openModal() {
        this.setState({isModalOpen: true});
    }
}

export default NfaToDfa;