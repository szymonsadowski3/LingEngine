import React from 'react';

import 'jsoneditor-react/es/editor.min.css';
import 'react-tagsinput/react-tagsinput.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import '../../../../node_modules/react-tabs/style/react-tabs.scss'
import VisualisationSection from "./subsections/visualisation-section";
import DfaToRegex from "./subsections/dfa-to-regex";

class UiContainer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Tabs>
                <TabList>
                    <Tab>Visualize Automata</Tab>
                    <Tab>Convert DFA to Regex</Tab>
                </TabList>

                <TabPanel>
                    <VisualisationSection />
                </TabPanel>
                <TabPanel>
                    <DfaToRegex />
                </TabPanel>
            </Tabs>
        );
    }
}

export default UiContainer;