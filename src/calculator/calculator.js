import {
    shunt,
    matchBrackets,
    checkExpression
} from './shuntingyard'

import {
    calculate,
    //rollDice,
    print
} from './roller'

import {
    map,
    chain,
    get,
    isLeft
} from '../functions/either'


import {
    compose,
    forEach,
    unfold,
    reduce
} from '../functions/funcy'

import {
    parse,
    fold
} from '../functions/parser'

import {
    expression
} from './diceparser'

const visitDepth = (fn, tree, level = 0) => {
    fn(tree, level)
    if (tree.children && tree.children.length > 0) {
        forEach((child) => visitDepth(fn, child, level + 1), tree.children)
    }
}

const add = (a, b) => a + b

const randomFromRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const produceRoll = die => n => n > die.number.number ? false : [randomFromRange(1, die.diceType), n + 1];

const rollDice = (die) => {
    const values = unfold(produceRoll(die), 1)

    die.values = values
    die.total = reduce(add, 0, values)
}

export const calculateDice = (dicetext) => {

    const parsedDice = compose(fold, parse(expression))(dicetext)

    console.log(parsedDice.value)

    visitDepth((node) => {
        if (node.type === 'die') {
            rollDice(node)
        }
    }, {
        type: 'root',
        children: parsedDice.value
    })


    //const result = compose(get, map(calculate), chain(checkExpression), map(shunt), chain(matchBrackets))(rolledDice)

    //console.log(result)

    return {
        rolled: '', //compose(get, map(print))(rolledDice),
        result: 12
    }
}