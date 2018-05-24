import React from 'react';
import Graph from 'react-graph-vis';
import axios from 'axios';

import map from 'lodash/map';

import ace from "brace";
import 'brace/mode/json';
import 'brace/theme/github';

import TagsInput from "react-tagsinput";
import ReactLoading from 'react-loading';

import Modal from 'react-awesome-modal';

import { JsonEditor as Editor } from 'jsoneditor-react';
import { minimizeDfaApi } from "../../../../config/api-endpoints";
import TransitionMapInfoInModal from "../../stateless-helpers/transition-map-info-in-modal";
import {
    minimizeExampleMapFormat, standardTransitionMapFormat,
    visOptions
} from "../../../../constants/constants-values";
import clone from "lodash/clone";
import {converter} from "../../../../utils/transform-from-dfa-to-graph";


class MinimizeDfa extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alphabet: ["a", "b"],
            states: [0, 1],
            initial: [0],
            finals: [0],
            transitionMap: {},
            graphInput: null,
            isModalOpen: false,

            loading: false,
        };

        this._handleAlphabetChange = this._handleAlphabetChange.bind(this);
        this._handleStatesChange = this._handleStatesChange.bind(this);
        this._handleInitialChange = this._handleInitialChange.bind(this);
        this._handleFinalsChange = this._handleFinalsChange.bind(this);
        this._handleTransitionMapChange = this._handleTransitionMapChange.bind(this);
        this._prepareRequestFromState = this._prepareRequestFromState.bind(this);
        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._minimizeDfa = this._minimizeDfa.bind(this);
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

        return <div className="rfa-to-regex-container container">
            <Modal visible={this.state.isModalOpen} width="600" effect="fadeInUp" onClickAway={() => this._closeModal()}>
                <div className="container">
                    <TransitionMapInfoInModal
                        format={standardTransitionMapFormat}
                        example={minimizeExampleMapFormat}
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

            <button type="button" className="btn btn-primary mt-3" onClick={this._minimizeDfa}>
                Minimize
            </button>

            {
                this.state.loading &&
                <div className="spin-wrapper mt-4">
                    <ReactLoading height={30} width={30} color={"#000000"} type={"spin"}/>
                </div>
            }

            <hr/>

            {
                console.log(this.state.graphInput)
            }

            {this.state.graphInput &&
            <div className="graph-wrapper">
                <Graph graph={converter(this.state.graphInput)} options={visOptions} events={events}/>
            </div>}
        </div>
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

    _prepareRequestFromState() {
        const { alphabet, states, initial, finals, transitionMap } = this.state;

        return {
            alphabet: alphabet,
            states: map(states, String),
            initial: initial[0].toString(),
            finals: map(finals, String),
            transitionMap: transitionMap,
        };
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

    _minimizeDfa() {
        this.setState({
            loading: true,
        });

        const request = this._prepareRequestFromState(this.state);
        const component = this;

        axios.post(minimizeDfaApi, request).then(function (response) {
            const stateToSet = {
                resultingTransitionMap: response.data.transitionMap,
                resultingStates: response.data.states,
                resultingInitial: response.data.initial,
                resultingFinals: response.data.finals,
                resultingAlphabet: response.data.alphabet,
            };

            component.setState({
                ...stateToSet,
                graphInput: component._generateGraphInput(stateToSet),
                loading: false,
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

export default MinimizeDfa;