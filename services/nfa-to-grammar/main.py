from grammar import RegularGrammar
from nfa import NFA

grammar = RegularGrammar.from_nfa(NFA.load("div3.json"))

print(grammar.productions())
        # self.assertTrue(grammar.initial_symbol() == "S'")
        # self.assertTrue(
        #     grammar.productions() ==
        #     {
        #         "S'": {"0S", "1A", "0", "&"},
        #         "S":  {"0S", "1A", "0"},
        #         "A":  {"0B", "1S", "1"},
        #         "B":  {"0A", "1B"}
        #     })
        #
        # grammar = RegularGrammar.from_nfa(NFA.load("examples/endsWbb.json"))
        # self.assertTrue(grammar.initial_symbol() == "S")
        # self.assertTrue(
        #     grammar.productions() ==
        #     {
        #         "S": {"aS", "bS", "bA"},
        #         "A": {"b", "bB"}
        #     })