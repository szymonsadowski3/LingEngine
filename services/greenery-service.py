from flask import Flask, jsonify, request
from flask_cors import CORS
from greenery import fsm, lego

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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


if __name__ == '__main__':
    app.run(threaded=True, debug=True, port=5000)
