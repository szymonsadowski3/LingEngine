from automata.fa.dfa import DFA
from automata.fa.nfa import NFA
from flask import Flask, jsonify, request
from flask_cors import CORS
from greenery import fsm, lego

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Headers', 'Cache-Control')
    response.headers.add('Access-Control-Allow-Headers', 'X-Requested-With')
    response.headers.add('Access-Control-Allow-Headers', 'Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    return response


@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({
        "message" : "ok"
    })


@app.route('/dfa/to/regex', methods=['POST'])
def dfa_to_regex():
    received_json = request.get_json(silent=True)

    constructed_automata = fsm.fsm(
        alphabet=set(received_json['alphabet']),
        states=set(received_json['states']),
        initial=received_json['initial'],
        finals=set(received_json['finals']),
        map=received_json['map'],
    )

    constructed_regex = lego.from_fsm(constructed_automata)
    constructed_regex.reduce()

    return jsonify({
        "regex": str(lego.from_fsm(constructed_automata))
    })


@app.route('/regex/to/dfa', methods=['POST'])
def regex_to_dfa():
    received_json = request.get_json(silent=True)

    received_regex = received_json['regex']
    constructed_regex = lego.parse(received_regex)
    constructed_fsm = constructed_regex.to_fsm()

    alphabet = list(constructed_fsm.alphabet)
    prepared_alphabet = [letter for letter in alphabet if not isinstance(letter, fsm.anything_else_cls)]

    response = {
        "alphabet": prepared_alphabet,
        "states": list(constructed_fsm.states),
        "finals": list(constructed_fsm.finals),
        "initial": str(constructed_fsm.initial),
        "map": constructed_fsm.map,
    }

    return jsonify(response)


@app.route('/nfa/to/dfa', methods=['POST'])
def nfa_to_dfa():
    json = request.get_json()
    states = json['states']
    alphabet = json['alphabet']
    initial = json['initial']
    mapping = json['mapping']
    finals = json['finals']
    nfa = NFA(
        states=set(states),
        input_symbols=set(alphabet),
        initial_state=initial,
        transitions=mapping,
        final_states=set(finals)
    )
    dfa = DFA(nfa)
    return jsonify(
        {
            "alphabet": list(dfa.input_symbols),
            "states": list(dfa.states),
            "initial": dfa.initial_state,
            "finals": list(dfa.final_states),
            "mapping": dfa.transitions
        }
    )


if __name__ == '__main__':
    app.run(threaded=True, debug=True, port=5000)
