import {
    many,
    sequence,
    choice,
    str,
    regex,
    map,
    between,
    opt,
    lazy
} from '../functions/parser'

import {
    compose,
    merge,
    map as mapList
} from '../functions/funcy'

const operators = {
    '^': {
        precedence: 4,
        associativity: 'right',
        arity: 2
    },
    '/': {
        precedence: 3,
        associativity: 'left',
        arity: 2
    },
    '*': {
        precedence: 3,
        associativity: 'left',
        arity: 2
    },
    '+': {
        precedence: 2,
        associativity: 'left',
        arity: 2
    },
    '-': {
        precedence: 2,
        associativity: 'left',
        arity: 2
    }
}

const projectModifier = (modifier) => {
    
    switch (modifier[0]){

        case 'k':
        case 'kh':
            return {
                action: 'kh',
                number: (modifier[1].length === 0) ? 1 : parseInt(modifier[1][0], 10)
            }

        case 'kl':
            return {
                action: 'kl',
                number: (modifier[1].length === 0) ? 1 : parseInt(modifier[1][0], 10)
            }

        case 'd':
        case 'dh':
            return {
                action: 'dh',
                number: (modifier[1].length === 0) ? 1 : parseInt(modifier[1][0], 10)
            } 

        case 'dl':
            return {
                action: 'dl',
                number: (modifier[1].length === 0) ? 1 : parseInt(modifier[1][0], 10)
            }

        case '<=':
        case '>=':
        case '<':
        case '>':
        case '=':
            return {
                action: modifier[0],
                number: (modifier[1].length === 0) ? 1 : parseInt(modifier[1][0], 10)
            }

        case 'r':
            return {
                action: 'r',
                comparer: (modifier[1].length === 0) ? '=': modifier[1][0],
                number: (modifier[2].length === 0) ? 1 : parseInt(modifier[2][0], 10)
            }

        case 'ro':
            return {
                action: 'ro',
                comparer: (modifier[1].length === 0) ? '=': modifier[1][0],
                number: (modifier[2].length === 0) ? 1 : parseInt(modifier[2][0], 10)
            }
    }
}

const projectDie = (die) => {

    let number

    if ('type' in die[0]){
        number = merge({}, die[0])
    } else {
         number = {
             type: 'fixed',
             number: die[0].length === 0 ? 1 : parseInt(die[0][0], 10)
         }
    }

    const diceType = parseInt(die[2], 10)
    const modifiers = mapList(projectModifier, die[3]) 

    return {
        type: 'die',
        number,
        diceType,
        modifiers
    }
}

const projectGroup = (group) => {
    return {
        type: 'group',
        group: group[1]
    }
}

const projectNumber = (num) => ({
    type: 'number',
    number: Number(num)
})

const projectOperator = (op) => merge({
    type: 'operator',
    operation: op
}, operators[op])

const projectBracket = (br) => ({
    type: 'bracket',
    bracket: br[1]
})

const projectComma = (br) => ({
    type: 'comma'
})

const projectLabel = (label) => ({
    type: 'label',
    name: label[1]
})

const digits = regex(/[0-9]+/)
const chars = regex(/[a-zA-Z0-9]+/)
const whitespace = regex(/\s+/)

const betweenWhitespace = (parser) => between(opt(whitespace), parser, opt(whitespace))

const keep = sequence([choice([str('kh'), str('kl'), str('k')]), opt(digits)])

const drop = sequence([choice([str('dh'), str('dl'), str('d')]), opt(digits)])

const sorted = choice([str('sa'), str('sd'), str('s')])

const critical = sequence([choice([str('cs'), str('r')]), opt(choice([str('<='), str('>='), str('<'), str('>'), str('=')])), opt(digits)])

const success = sequence([choice([str('<='), str('>='), str('<'), str('>'), str('=')]), digits])

const reroll = sequence([choice([str('ro'), str('r')]), opt(choice([str('<='), str('>='), str('<'), str('>'), str('=')])), opt(digits)])

const modifier = choice([keep, drop, success, reroll, sorted, critical])

const label = compose(map(projectLabel), betweenWhitespace, sequence)([str('['), chars, str(']')])

const num = compose(map(projectNumber), betweenWhitespace)(digits)

const operator = compose(map(projectOperator), betweenWhitespace, choice)([str('+'), str('-'), str('*'), str('/'), str('^')])

const bracket = lazy(() => compose(map(projectBracket), betweenWhitespace, sequence)([str('('), expression, str(')')]))

const die = compose(map(projectDie), betweenWhitespace, sequence)([choice([label, opt(digits)]), str('d'), digits, many(modifier)])

const group = lazy(() => compose(map(projectGroup), betweenWhitespace, sequence)([str('{'), sepBy(',', expression), str('}'), many(modifier)]))

const expression = compose(many, choice)([group, die, num, operator, bracket, label])

export {
    expression
}