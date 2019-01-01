import {
    forEach,
    last
} from '../functions/funcy'

const createNode = (token, left, right) => ({
    token,
    left,
    right
})

const addOpertorNode = (outstack, opstack) => {
    const rightNode = outstack.pop()
    const leftNode = outstack.pop()

    outstack.push(createNode(opstack.pop(), leftNode, rightNode))
}

export const toAST = (tokens) => {
    let outStack = []
    let opStack = []

    forEach((token) => {

        if (token.type === 'number' || token.type === 'dice' || token.type === 'group') {
            outStack.push(createNode(token, null, null))
        } else if (token.type === 'operator') {

            //while there is an operator token o2, at the top of the operator stack and either
            while ((last(opStack) !== undefined && last(opStack).type === 'operator')
                //o1 is left-associative and its precedence is less than or equal to that of o2, or
                &&
                ((token.associativity === 'left' && token.precedence <= last(opStack).precedence)
                    //o1 is right associative, and has precedence less than that of o2,
                    ||
                    (token.associativity === 'right' && token.precedence < last(opStack).precedence))) {

                addOpertorNode(outStack, opStack)
            }

            //at the end of iteration push o1 onto the operator stack
            opStack.push(token)

        } else if (token.type === 'left-bracket') {
            opStack.push(token)
        } else if (token.type === 'right-bracket') {
            while (last(opStack) !== undefined && last(opStack).type !== 'left-bracket') {
                addOpertorNode(outStack, opStack)
            }

            //remove left-bracket
            opStack.pop()
        }

    }, tokens)

    while (last(opStack) !== undefined) {
        addOpertorNode(outStack, opStack)
    }

    return outStack.pop()
}