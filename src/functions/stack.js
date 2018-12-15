const Stack = (head, tail) => ({
    type: 'Stack',
    head,
    tail
})

const Empty = () => ({
    type: 'Stack:Empty'
})

const empty = () => {
    return Stack(Empty())
}

const push = (item, stack) => {
    return Stack(item, stack)
}

const pop = (stack) => {
   return stack.tail === undefined ?  empty() : stack.tail
}

const peek = (stack) => {
    return stack.head
}

const isEmpty = (stack) => {
    return (stack.head === undefined || stack.head.type === 'Stack:Empty')
}

const reverse = (stack) => {
    let reverseStack = empty()

    while (!isEmpty(stack)) {
        reverseStack = push(peek(stack), reverseStack)
        stack = pop(stack)
    }

    return reverseStack
}

export {
    push,
    pop,
    peek,
    empty,
    isEmpty,
    reverse
}