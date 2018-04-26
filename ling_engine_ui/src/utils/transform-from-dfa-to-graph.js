import forEach from 'lodash/forEach';
import map from 'lodash/map';
import keys from 'lodash/keys';
import toPairs from 'lodash/toPairs';
import find from 'lodash/find';

export function converter(dfa) {
    const outputNodes = map(dfa.states, (state, index) => {
        return {id: state, label: "" + state}
    });

    let outputEdges = [];

    const dfaMap = dfa.transitionMap;
    const dfaMapKeys = keys(dfaMap);

    forEach(dfaMapKeys, (key) => {
        const transitionPairs = toPairs(dfaMap[key]);
        forEach(transitionPairs, (transitionPair) => {
            let potentialExistingEdge = find(outputEdges, {from: key, to: transitionPair[1]});

            if (potentialExistingEdge) {
                potentialExistingEdge.label += `,${transitionPair[0]}`;
            } else {
                const edge = {from: key, to: transitionPair[1], label: transitionPair[0], smooth: {type: 'curvedCW', roundness: 0.2}};
                outputEdges.push(edge);
            }
        });
    });

    return {
        nodes: outputNodes,
        edges: outputEdges
    }
}