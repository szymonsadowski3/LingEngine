export const visOptions = {
    edges: {
        smooth: {
            type: 'cubicBezier',
            roundness: 0.4
        }
    },
    layout: {
        improvedLayout: true,
        hierarchical: {
            enabled: false,
            levelSeparation: 150,
            nodeSpacing: 100,
            treeSpacing: 200,
            blockShifting: true,
            edgeMinimization: true,
            parentCentralization: true,
            direction: 'UD',        // UD, DU, LR, RL
            sortMethod: 'hubsize'   // hubsize, directed
        },
    },
    physics:false,
    height: '350px',
};

export const exampleTransitionMap = {
    "0": {
        "a": "0",
        "b": "1",
        "c": "0"
    },
    "1": {
        "a": "1",
        "b": "0",
        "c": "1"
    }
};

export const exampleStandardTransitionMap =                            `
{
    "0": {
        "a": "0",
        "b": "1",
        "c": "0"
    },
    "1": {
        "a": "1",
        "b": "0",
        "c": "1"
    }
}
                            `;

export const standardTransitionMapFormat =                         `
{
    "[input_state_0]": {
        "[signal_0]": "[some_input_state]",
        "[signal_1]": "[some_input_state]",
        "[signal_2]": "[some_input_state]",
        ...
    },
    "[input_state_1]": {
        "[signal_0]": "[some_input_state]",
        "[signal_1]": "[some_input_state]",
        "[signal_2]": "[some_input_state]",
        ...
    },
    ...
}`;

export const nfaTransitionMapFormat =                         `
{
    "[input_state_0]": {
        "[signal_0]": "[list_of_input_states]",
        "[signal_1]": "[list_of_input_states]",
        "[signal_2]": "[list_of_input_states]",
        ...
    },
    "[input_state_1]": {
        "[signal_0]": "[some_input_state]",
        "[signal_1]": "[some_input_state]",
        "[signal_2]": "[some_input_state]",
        ...
    },
    ...
}`;

export const nfaTransitionMapExample = `
{
    "q0": {
        "a": [
            "q1"
        ]
    },
    "q1": {
        "a": [
            "q1"
        ],
        "": [
            "q2"
        ]
    },
    "q2": {
        "b": [
            "q0"
        ]
    }
}
`;