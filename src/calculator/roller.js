import {
    peek,
    pop,
    push,
    empty
} from '../functions/stack'

import {
    compose,
    reduce,
    unfold,
    merge,
    map,
    join
} from '../functions/funcy'

const add = (a, b) => a + b
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const divide = (a, b) => a / b
const power = (a, b) => Math.pow(a, b)

const combineTopTwo = (combiner, stack) => {
    const fst = peek(stack)
    stack = pop(stack)
    const snd =peek(stack)
    stack = pop(stack)

    return push(combiner(snd, fst), stack)
}

const randomFromRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const calculateStep = (stack, step) => {
    switch (step.type) {
        case 'die':
            return push(step.total, stack)
        case 'number':
            return push(step.number, stack)

        case 'operator':
            switch (step.operation) {
                case '+':
                    return combineTopTwo(add, stack)
                case '-':
                    return combineTopTwo(subtract, stack)
                case '*':
                    return combineTopTwo(multiply, stack)
                case '/':
                    return combineTopTwo(divide, stack)
                case '^':
                    return combineTopTwo(power, stack)
            }
    }
}

//calculate :: Array -> Number
const calculate = compose(peek, reduce(calculateStep, empty()))

//produceRoll :: Object -> Number -> (Boolean || [Number, Number])
const produceRoll = step => n => n > step.number ? false : [randomFromRange(1, step.diceType), n + 1];

//rollDie :: Object -> Object
const rollDie = (step) => {

    if (step.type === 'die') {
        //TODO: modifiers
        const values = unfold(produceRoll(step), 1)

        return merge(step, {
            values,
            total: reduce(add, 0, values)
        })
    } else {
        return step
    }
}

//rollDice :: Array -> Array
const rollDice = map(rollDie)

//pad :: String -> String -> String -> String
const pad = (str, padstart, padend) => padstart + str + (padend || padstart)

//printStep :: String -> Object -> String
const printStep = (state, step) => {
    switch (step.type) {
        case 'die':
            return state + pad(join(' + ', step.values), ' [ ', ' ] ')
        case 'number':
            return state + pad(step.number, ' ')
        case 'operator':
            return state + pad(step.operation, ' ')
        case 'bracket':
            return state + pad(step.bracket, ' ')
        default:
            return state
    }
}

//print :: Array => String
const print = reduce(printStep, '')

export {
    calculate,
    rollDice,
    print
}