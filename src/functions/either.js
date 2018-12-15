const Left = (a) => ({
    type: 'Left',
    value: a
})

const Right = (a) => ({
    type: 'Right',
    value: a
})

const isLeft = (either) => (either.type === 'Left')

const isRight = (either) => (either.type === 'Right')

const fromNullable = (a) => a !== null ? Right(a) : Left(a)

const of = (a) => Right(a)

const ap = (b) => (either) => isLeft(either) ? either : map(b, either.value)

const map = (f) => (either) => isLeft(either) ? either : of(f(either.value))

const chain = (f) => (either) => isLeft(either) ? () => {} : f(either.value)

const get = (either) => isRight(either) ? either.value : undefined

const getOrElse = (value) => (either) => isRight(either) ? either.value : value

const merge = (either) => either.value

const fold = (f, g) => (either) => isRight(either) ? g(either.value) : f(either.value)

export {
    Left,
    Right,
    isLeft,
    isRight,
    fromNullable,
    of,
    ap,
    map,
    chain,
    get,
    getOrElse,
    merge,
    fold
}