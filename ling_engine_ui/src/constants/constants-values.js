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
    physics:false
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