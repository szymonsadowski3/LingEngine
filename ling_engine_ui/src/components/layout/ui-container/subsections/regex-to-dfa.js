import React from 'react';
import Graph from 'react-graph-vis';

import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import axios from "axios/index";
import {regexToDfaApi} from "../../../../config/api-endpoints";
import JSONPretty from 'react-json-pretty';

import '../../../../../node_modules/react-json-pretty/src/JSONPretty.monikai.css';
import './regex-to-dfa.scss';
import {converter} from "../../../../utils/transform-from-dfa-to-graph";
import {visOptions} from "../../../../constants/constants-values";
import clone from "lodash/clone";

class DfaToRegex extends React.Component {
    constructor() {
        super();

        this.state = {
            regexInput: '',
        };

        this._handleRegexInput = this._handleRegexInput.bind(this);
        this._convertToDfa = this._convertToDfa.bind(this);
        this._onVisualize = this._onVisualize.bind(this);
    }

    render() {
        const events = {
            select: function (event) {
                const {nodes, edges} = event;
            }
        };

        return <div className="container regex-to-dfa-container mt-4">
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">Regex</span>
                </div>
                <input type="text" className="form-control"
                       placeholder="Type in regex" aria-label="Username" aria-describedby="basic-addon1"
                       value={this.state.regexInput} onChange={this._handleRegexInput}
                />
            </div>

            <button type="button" className="btn btn-primary" onClick={this._convertToDfa}>
                Convert to DFA
            </button>

            <hr />

            {this.state.alphabet && <dl className="row">
                <dt className="col-sm-3">Alphabet</dt>
                <dd className="col-sm-9">{JSON.stringify(this.state.alphabet)}</dd>

                <dt className="col-sm-3">States</dt>
                <dd className="col-sm-9">{JSON.stringify(this.state.states)}</dd>

                <dt className="col-sm-3">Initial state</dt>
                <dd className="col-sm-9">{JSON.stringify(this.state.initial)}</dd>


                <dt className="col-sm-3">Final states</dt>
                <dd className="col-sm-9">{JSON.stringify(this.state.finals)}</dd>

                <dt className="col-sm-3">Transition map</dt>
                <dd className="col-sm-9">
                    <JSONPretty id="json-pretty" json={this.state.transitionMap}/>
                </dd>
            </dl>}

            <hr />

            <button
                className="btn btn-success mt-3"
                onClick={this._onVisualize}>
                Visualize!
            </button>

            {this.state.graphInput &&
            <div className="graph-wrapper">
                <Graph graph={converter(this.state.graphInput)} options={visOptions} events={events}/>
            </div>}
        </div>;
    }

    _handleRegexInput(event) {
        this.setState({regexInput: event.target.value});
    }

    _convertToDfa() {
        const request = {
            regex: this.state.regexInput
        };

        const component = this;

        axios.post(regexToDfaApi, request).then(response => {
            this.setState({
                alphabet: response.data.alphabet,
                finals: response.data.finals,
                initial: response.data.initial,
                states: response.data.states,
                transitionMap: response.data.map,
            });
        }).catch(function (error) {
            alert('Error while fetchin data!');
        });
    }

    _onVisualize() {
        const generatedOut = this._generateGraphInput(this.state);

        this.setState(
            {
                graphInput: generatedOut
            }
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
}

export default DfaToRegex;