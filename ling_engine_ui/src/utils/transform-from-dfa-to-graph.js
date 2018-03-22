import forEach from 'lodash/forEach';
import map from 'lodash/map';
import keys from 'lodash/keys';
import toPairs from 'lodash/toPairs';
import find from 'lodash/find';

const graph = {
    nodes: [
        {id: 1, label: 'Node 1'},
        {id: 2, label: 'Node 2'},
        {id: 3, label: 'Node 3'},
        {id: 4, label: 'Node 4'},
        {id: 5, label: 'Node 5'}
    ],
    edges: [
        {from: 1, to: 2, label: 'abc'},
        {from: 1, to: 3},
        {from: 2, to: 4},
        {from: 2, to: 5}
    ]
};

// Note: Dfa Form:
// {
//     alphabet: ["a", "b"],
//     states: [0, 1],
//     initial: 0,
//     finals: [1],
//     map: {
//         0: {"a": 1, "b": 0},
//         1: {"a": 1, "b": 1},
//       }
// }

export function converter(dfa) {
    const outputNodes = map(dfa.states, (state, index) => {
        return {id: index, label: state}
    });

    let outputEdges = [];

    const dfaMap = dfa.map;
    const dfaMapKeys = keys(dfaMap);

    forEach(dfaMapKeys, (key) => {
        const transitionPairs = toPairs(dfaMap[key]);
        forEach(transitionPairs, (transitionPair) => {
            let potentialExistingEdge = find(outputEdges, {from: key, to: transitionPair[1]});

            if (potentialExistingEdge) {
                potentialExistingEdge.label += `,${transitionPair[0]}`;
            } else {
                const edge = {from: key, to: transitionPair[1], label: transitionPair[0]};
                outputEdges.push(edge);
            }
        });
    });

    return {
        nodes: outputNodes,
        edges: outputEdges
    }
}