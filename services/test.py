from greenery import fsm, lego

a = fsm.fsm(
    alphabet=["a"],
    states=[0, 1],
    initial=0,
    finals=[0],
    map={
        0: {"a": 0},
    },
)

legg = lego.from_fsm(a)

print(str(legg))
