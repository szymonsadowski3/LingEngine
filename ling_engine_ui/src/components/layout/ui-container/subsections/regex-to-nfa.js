import React from 'react';
import Graph from 'react-graph-vis';

import {regexToNfaApi} from "../../../../config/api-endpoints";
import JSONPretty from 'react-json-pretty';

import {converter} from "../../../../utils/transform-from-dfa-to-graph";
import {visOptions} from "../../../../constants/constants-values";
import clone from "lodash/clone";
import axios from "axios/index";
import ReactLoading from 'react-loading';

import '../../../../../node_modules/react-json-pretty/src/JSONPretty.monikai.css';
import './regex-to-nfa.scss';
import '../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class RegexToNfa extends React.Component {
    constructor() {
        super();

        this.state = {
            regexInput: '',
            loading: false
        };

        this._handleRegexInput = this._handleRegexInput.bind(this);
        this._convertToNfaAndVisualize = this._convertToNfaAndVisualize.bind(this);
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

            <button type="button" className="btn btn-primary"
                    onClick={this._convertToNfaAndVisualize} disabled={this.state.loading}>
                Convert to NFA & Visualize
            </button>

            {
                this.state.loading &&
                    <div className="spin-wrapper mt-4">
                        <ReactLoading height={30} width={30} color={"#000000"} type={"spin"}/>
                    </div>
            }

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

            {this.state.graphInput &&
            <div className="graph-wrapper mb-5">
                <Graph graph={converter(this.state.graphInput)} options={visOptions} events={events}/>
            </div>}
        </div>;
    }

    _handleRegexInput(event) {
        this.setState({regexInput: event.target.value});
    }

    _convertToNfaAndVisualize() {
        this.setState({
            loading: true,
        });

        const request = {
            regex: this.state.regexInput
        };

        const component = this;

        axios.post(regexToNfaApi, request).then(response => {
            this.setState({
                alphabet: response.data.alphabet,
                finals: response.data.finals,
                initial: response.data.initial,
                states: response.data.states,
                transitionMap: response.data.map,
            }, () => {
                const generatedOut = component._generateGraphInput(this.state);

                component.setState(
                    {
                        graphInput: generatedOut,
                        loading: false
                    }
                );
            });
        }).catch(function (error) {
            alert('Error while fetchin data!');
        });
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

export default RegexToNfa;