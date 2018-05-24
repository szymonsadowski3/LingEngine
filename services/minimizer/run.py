# {
#     "0": {
#         "a": "0",
#         "b": "1",
#         "c": "0"
#     },
#     "1": {
#         "a": "1",
#         "b": "0",
#         "c": "1"
#     }
# }

# ->

# (state, signal): state
from minimizer.dfa import DFA


def parse_ui_json_to_minimization_transitions(input_json):
    minimization_feed = {}
    for considered_state, signals_mapping in input_json.items():
        for signal, resulting_state in signals_mapping.items():
            minimization_feed[(considered_state, signal)] = resulting_state

    return minimization_feed


# {('3', 'a'): '2', ('3', 'b'): '4', ('4', 'b'): '3'}
def parse_minimization_transitions_to_ui_json(transitions):
    STATE_INDEX = 0
    SIGNAL_INDEX = 1

    ui_json = {}
    for state_and_signal_tuple, resulting_state in transitions.items():
        state = state_and_signal_tuple[STATE_INDEX]
        signal = state_and_signal_tuple[SIGNAL_INDEX]

        if state not in ui_json:
            ui_json[state] = {}

        ui_json[state][signal] = resulting_state

    return ui_json


def minimize_dfa(states, finals, initial, alphabet, mapping):
    minimization_feed = parse_ui_json_to_minimization_transitions(mapping)
    dfa = DFA(final_states=finals, start_state=initial, states_or_filename=states, terminals=alphabet,
              transitions=minimization_feed)

    dfa.minimize()
    dfa.transitions = {key: value for key, value in dfa.transitions.items() if key[1] in dfa.terminals}
    return dfa


if __name__ == '__main__':
    example_data = {
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

    feed = parse_ui_json_to_minimization_transitions(example_data)
    # print(parse_minimization_transitions_to_ui_json({('0', 'a'): '0', ('0', 'b'): '1', ('0', 'c'): '0', ('1', 'a'): '1', ('1', 'b'): '0', ('1', 'c'): '1'}))
    # result = minimize_dfa()
    # dfa = DFA(filename)
    # dfa = DFA(final_states=['3'], start_state='3', states_or_filename=['1', '2', '3', '4'], terminals=['a', 'b'], transitions={('3', 'a'): '2', ('3', 'b'): '4', ('4', 'b'): '3', ('4', 'a'): '1', ('2', 'b'): '1', ('2', 'a'): '3', ('1', 'a'): '1', ('1', 'b'): '1'})
    dfa = DFA(final_states=['1'], start_state='0', states_or_filename=['0', '1'], terminals=['a', 'b'],
              transitions={('0', 'a'): '0', ('0', 'b'): '1', ('0', 'c'): '0', ('1', 'a'): '1', ('1', 'b'): '0', ('1', 'c'): '1'})
    #
    dfa.minimize()
    dfa.transitions = {key: value for key, value in dfa.transitions.items() if key[1] in dfa.terminals}
    #
    print(dfa)
