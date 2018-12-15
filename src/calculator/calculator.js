import {
    shunt,
    matchBrackets,
    checkExpression
} from './shuntingyard'

import {
    calculate,
    rollDice,
    print
} from './roller'

import {
    map,
    chain,
    get,
    isLeft
} from '../functions/either'

import {
    compose
} from '../functions/funcy'

import {
    parse,
    fold
} from '../functions/parser'

import {
    expression
} from './diceparser'

export const calculateDice = (dicetext) => {
    const parsedDice = compose(fold, parse(expression))(dicetext)

    console.log(parsedDice.value)

    

    //const rolledDice = map(rollDice)(parsedDice)

    //console.log(rolledDice)

    //const result = compose(get, map(calculate), chain(checkExpression), map(shunt), chain(matchBrackets))(rolledDice)

    //console.log(result)

    return {
        rolled: '', //compose(get, map(print))(rolledDice),
        result: 12
    }
}