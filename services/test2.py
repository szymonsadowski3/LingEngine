from greenery import fsm, lego

reg = lego.parse("a*")

constr = reg.to_fsm()

print(str(constr))
