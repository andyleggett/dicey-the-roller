



import {
    compose,
    forEach,
    unfold,
    reduce,
    is
} from '../functions/funcy'

const add = (a, b) => a + b

const randomFromRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1))

const produceRoll = (num, type) => n => n > num ? false : [randomFromRange(1, type), n + 1];

const calculateDice = (labels, dice) => {
    const quantity = is(Array, dice.quantity) ? dice.quantity[0] : dice.quantity //optional number
    const diceType = dice.diceType
    let values
    let total

    switch(quantity.type){
        case 'dice-number':
            values = unfold(produceRoll(quantity.number, diceType), 1) //TODO: later - move to rolling step and use value here instead
            console.log(values)
            total = reduce(add, 0, values)
            console.log(total)
            return total

        case 'label':
            values = unfold(produceRoll(labels[quantity.name], diceType), 1) //TODO: later - move to rolling step and use value here instead
            console.log(values)
            total = reduce(add, 0, values)
            console.log(total)
            return total
    }
}


export const createEvaluator = (labels) => {
    
    const evaluate = (node) => {
        if (node.token.type === 'operator') {
            switch(node.token.operation){
                case '^': 
                    return Math.pow(evaluate(node.left), evaluate(node.right))

                case '+': 
                    return evaluate(node.left) + evaluate(node.right)

                case '-': 
                    return evaluate(node.left) - evaluate(node.right)

                case '*': 
                    return evaluate(node.left) * evaluate(node.right)

                case '/': 
                    return evaluate(node.left) / evaluate(node.right)
            }
        } else {
            switch(node.token.type){
                case 'number':
                    return node.token.number
                case 'dice':
                    return calculateDice(labels, node.token)
            }
        }
    }
    
    return evaluate
}