import {
    many,
    sequence,
    choice,
    str,
    regex,
    map,
    sepBy,
    opt,
    lazy,
    parse
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

const entryOrOne = (lst) => (lst.length === 0) ? 1 : parseInt(lst[0], 10)

const entryOrDefault = (lst, dft) => (lst.length === 0) ? dft : lst[0]

const projectModifier = (modifier) => {
    switch (modifier[0]) {
        case 'k':
        case 'kh':
            return {
                action: 'kh',
                number: entryOrOne(modifier[1])
            }

        case 'kl':
            return {
                action: 'kl',
                number: entryOrOne(modifier[1])
            }

        case 'd':
        case 'dh':
            return {
                action: 'dh',
                number: entryOrOne(modifier[1])
            }

        case 'dl':
            return {
                action: 'dl',
                number: entryOrOne(modifier[1])
            }

        case '<=':
        case '>=':
        case '<':
        case '>':
        case '=':
            return {
                action: modifier[0],
                number: entryOrOne(modifier[1])
            }

        case 'r':
            return {
                action: 'r',
                comparer: entryOrDefault(modifier[1], '='),
                number: entryOrOne(modifier[2])
            }

        case 'ro':
            return {
                action: 'ro',
                comparer: entryOrDefault(modifier[1], '='),
                number: entryOrOne(modifier[2])
            }
    }
}

const projectComputed = (computed) => {
    return {
        type: 'computed',
        first: computed[1],
        operator: computed[2],
        second: computed[3]
    }
}

const projectDice = (dice) => {
    const quantity = dice[0]
    const diceType = parseInt(dice[2], 10)
    const modifiers = mapList(projectModifier, dice[3])

    return {
        type: 'dice',
        quantity,
        diceType,
        modifiers
    }
}

const projectGroupPart = (group) => {
    return {
        type: 'group-part',
        children: group
    }
}

const projectGroup = (group) => {
    return {
        type: 'group',
        children: mapList(projectGroupPart, group[1]),
        modifiers: mapList(projectModifier, group[3])
    }
}

const projectNumber = (num) => ({
    type: 'number',
    number: Number(num)
})

const projectDiceNumber = (num) => ({
    type: 'dice-number',
    number: num.length === 0 ? 1 : Number(num[0])
})

const projectOperator = (op) => merge({
    type: 'operator',
    operation: op
}, operators[op])

const projectBracket = (br) => ({
    type: (br === '(') ? 'left-bracket' : 'right-bracket'
})

const projectLabel = (label) => ({
    type: 'label',
    name: label[1]
})

const digits = regex(/[0-9]+/)

const chars = regex(/[a-zA-Z0-9]+/)

const keep = sequence([choice([str('kh'), str('kl'), str('k')]), opt(digits)])

const drop = sequence([choice([str('dh'), str('dl'), str('d')]), opt(digits)])

const sorted = choice([str('sa'), str('sd'), str('s')])

const critical = sequence([choice([str('cs'), str('r')]), opt(choice([str('<='), str('>='), str('<'), str('>'), str('=')])), opt(digits)])

const success = sequence([choice([str('<='), str('>='), str('<'), str('>'), str('=')]), digits])

const reroll = sequence([choice([str('ro'), str('r')]), opt(choice([str('<='), str('>='), str('<'), str('>'), str('=')])), opt(digits)])

const modifier = choice([keep, drop, success, reroll, sorted, critical])

const label = compose(map(projectLabel), sequence)([str('['), chars, str(']')])

const num = map(projectNumber)(digits)

const diceNum = map(projectDiceNumber)(digits)

const operator = compose(map(projectOperator), choice)([str('+'), str('-'), str('*'), str('/'), str('^')])

const bracket = compose(map(projectBracket), choice)([str('('), str(')')])

const computed = compose(map(projectComputed), sequence)([str('('), choice([num, label]), operator, choice([num, label]), str(')')])

const group = lazy(() => compose(map(projectGroup), sequence)([str('{'), sepBy(expression, str(',')), str('}'), many(modifier)]))

const dice = compose(map(projectDice), sequence)([choice([computed, label, opt(diceNum)]), str('d'), digits, many(modifier)])

const expression = compose(many, choice)([group, dice, num, operator, bracket, label])

export const diceParse = parse(expression)