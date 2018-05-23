from automata.fa.dfa import DFA
# DFA which matches all binary strings ending in an odd number of '1's
dfa = DFA(
    states={'a', 'b'},
    input_symbols={'0', '1'},
    transitions={
        'a': {'0': 'a', '1': 'a'},
        'b': {'0': 'a', '1': 'a'}
    },
    initial_state='a',
    final_states={'a'}
)

dfa.minimize()

