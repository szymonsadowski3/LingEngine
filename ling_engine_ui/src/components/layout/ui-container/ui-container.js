import React from 'react';

import 'jsoneditor-react/es/editor.min.css';
import 'react-tagsinput/react-tagsinput.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import '../../../../node_modules/react-tabs/style/react-tabs.scss'
import VisualisationSection from "./subsections/visualisation-section";
import DfaToRegex from "./subsections/dfa-to-regex";
import RegexToDfa from "./subsections/regex-to-nfa";
import NfaToDfa from "./subsections/nfa-to-dfa";
import MinimizeDfa from "./subsections/minimize-dfa";

class UiContainer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Tabs className="container">
                <TabList>
                    <Tab>Visualize Automata</Tab>
                    <Tab>Convert DFA to Regex</Tab>
                    <Tab>Convert Regex to NFA</Tab>
                    <Tab>Convert NFA to DFA</Tab>
                    <Tab>Minimize DFA</Tab>
                </TabList>

                <TabPanel>
                    <VisualisationSection />
                </TabPanel>
                <TabPanel>
                    <DfaToRegex />
                </TabPanel>
                <TabPanel>
                    <RegexToDfa />
                </TabPanel>
                <TabPanel>
                    <NfaToDfa />
                </TabPanel>
                <TabPanel>
                    <MinimizeDfa />
                </TabPanel>
            </Tabs>
        );
    }
}

export default UiContainer;