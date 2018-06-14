from copy import deepcopy


def convert_array_transitions_to_common(array_transitions):
    transition_entries = array_transitions['transitions']

    new_transition_structure = {}

    for transition_entry in transition_entries:
        input_state = transition_entry[0]
        signal = transition_entry[1]
        output_states = transition_entry[2]

        if input_state not in new_transition_structure:
            new_transition_structure[input_state] = {}

        new_transition_structure[input_state][signal] = output_states

    return new_transition_structure


def convert_common_to_array_transitions(common_transitions):
    common_transitions_copy = deepcopy(common_transitions)
    resulting_array_transition = []

    for input_state, transitions_for_this_state in common_transitions_copy.items():
        for signal, output_state in transitions_for_this_state.items():
            new_entry = [input_state, signal, common_transitions_copy[input_state][signal]]
            resulting_array_transition.append(new_entry)

    return resulting_array_transition


def run_main():
    result = convert_common_to_array_transitions(COMMON_TRANSITION)
    print(result)


# "transitions": [
#         [
#             "S",
#             "0",
#             [
#                 "S"
#             ]
#         ],
#         [
#             "S",
#             "1",
#             [
#                 "A"
#             ]
#         ],



### FROM
# {
#     "[input_state_0]": {
#         "[signal_0]": "[list_of_input_states]",
#         "[signal_1]": "[list_of_input_states]",
#         "[signal_2]": "[list_of_input_states]",
#         ...
#     },
#     "[input_state_1]": {
#         "[signal_0]": "[some_input_state]",
#         "[signal_1]": "[some_input_state]",
#         "[signal_2]": "[some_input_state]",
#         ...
#     },
#     ...
# }


# # {
#     "states": [
#         "S",
#         "A",
#         "B"
#     ],
#     "alphabet": [
#         "0",
#         "1"
#     ],
#     "transitions": [
#         [
#             "S",
#             "0",
#             [
#                 "S"
#             ]
#         ],
#         [
#             "S",
#             "1",
#             [
#                 "A"
#             ]
#         ],
#         [
#             "A",
#             "0",
#             [
#                 "B"
#             ]
#         ],
#         [
#             "A",
#             "1",
#             [
#                 "S"
#             ]
#         ],
#         [
#             "B",
#             "0",
#             [
#                 "A"
#             ]
#         ],
#         [
#             "B",
#             "1",
#             [
#                 "B"
#             ]
#         ]
#     ],
#     "initial_state": "S",
#     "final_states": [
#         "S"
#     ]
# }

COMMON_TRANSITION = {
    "q0": {
      "a": [
        "q1"
      ]
    },
    "q1": {
      "a": [
        "q1"
      ]
    },
    "q2": {
      "b": [
        "q0"
      ]
    }
  }

if __name__ == '__main__':
    run_main()