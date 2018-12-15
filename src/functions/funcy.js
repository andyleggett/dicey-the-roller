const curry = (f) => (...args) => {
    const next = (...partialargs) => {
        if (partialargs.length >= f.length) {
            return f(...partialargs)
        } else {
            return (...lessargs) => next(...partialargs, ...lessargs)
        }
    }

    return next(...args)
}

const compose = (...fs) => (...args) => {
    let idx = fs.length - 1
    let f = fs[idx]
    let result = f(...args)

    while (idx > 0) {
        idx -= 1
        f = fs[idx]
        result = f(result)
    }

    return result
}

const map = curry((f, xs) => {
    let ys = []
    let idx = 0

    while (idx < xs.length) {
        ys[idx] = f(xs[idx], idx)
        idx += 1
    }

    return ys
})

const reduce = curry((f, seed, xs) => {
    let o = seed
    let idx = 0

    while (idx < xs.length) {
        o = f(o, xs[idx], idx)
        idx += 1
    }

    return o
})

const reduceRight = curry((f, seed, xs) => {
    let o = seed
    let idx = xs.length - 1

    while (idx >= 0) {
        o = f(o, xs[idx], idx)
        idx -= 1
    }

    return o
})

const filter = curry((pred, xs) => {
    let ys = []
    let idx = 0
    let newIdx = 0

    while (idx < xs.length) {
        let cur = xs[idx]
        if (pred(cur) === true) {
            ys[newIdx] = cur
            newIdx += 1
        }
        idx += 1
    }

    return ys
})

const reject = curry((pred, xs) => {
    let ys = []
    let idx = 0
    let newIdx = 0

    while (idx < xs.length) {
        let cur = xs[idx]
        if (pred(cur) === false) {
            ys[newIdx] = cur
            newIdx += 1
        }
        idx += 1
    }

    return ys
})

const count = curry((pred, xs) => {
    let idx = 0
    let count = 0

    while (idx < xs.length) {
        let cur = xs[idx]
        if (pred(cur) === true) {
            count += 1
        }
        idx += 1
    }

    return count
})

const repeat = (count, value) => {
    let idx = 0
    let ys = []

    while (idx < count) {
        if (is(Object, value) === true){
            ys[idx] = merge({}, value)
        } else {
            ys[idx] = value
        }

        idx += 1
    }

    return ys
}

const find = curry((pred, xs) => {
    let idx = 0

    while (idx < xs.length) {
        let cur = xs[idx]
        if (pred(cur) === true) {
            return cur
        }
        idx += 1
    }
})

const exists = curry((pred, xs) => {
    let idx = 0

    while (idx < xs.length) {
        let cur = xs[idx]
        if (pred(cur) === true) {
            return true
        }
        idx += 1
    }

    return false
})

const findIterator = curry((pred, xs) => {
    let x

    do {
        x = xs.next()
        if (pred(x.value) === true) {
            return x.value
        }
    } while (x.done === false)
})


const forEach = curry((f, xs) => {
    let idx = 0

    while (idx < xs.length) {
        f(xs[idx], idx)
        idx += 1
    }

    return xs
})

const append = curry((x, xs) => {
    let ys = []
    let idx = 0

    while (idx < xs.length) {
        ys[idx] = xs[idx]
        idx += 1
    }

    ys[idx] = x

    return ys
})

const prepend = curry((x, xs) => {
    let ys = [x]
    let idx = 0

    while (idx < xs.length) {
        ys[idx + 1] = xs[idx]
        idx += 1
    }

    return ys
})

const equals = curry((a, b) => a === b)

const reverse = (xs) => {
    let ys = []
    let idx = xs.length - 1
    let idy = 0

    while (idx >= 0) {
        ys[idy] = xs[idx]
        idx -= 1
        idy += 1
    }

    return ys
}

const flip = (f) => curry((a, b) => f(b, a))

const flatten = (xs) => {
    return reduce((flat, toFlatten) => {
        return concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten, flat)
      }, [], xs)
}

const head = (xs) => xs[0]

const tail = (xs) => {
    let ys = []
    let idx = 1

    while (idx < xs.length) {
        ys[idx - 1] = xs[idx]
        idx += 1
    }

    return ys
}

const init = (xs) => {
    let ys = []
    let idx = 0

    while (idx < xs.length - 1) {
        ys[idx] = xs[idx]
        idx += 1
    }

    return ys
}

const last = (xs) => xs[xs.length - 1]

const contains = curry((x, xs) => {
    let idx = 0

    while (idx < xs.length) {
        if (xs[idx] === x) {
            return true
        }
        idx += 1
    }

    return false
})

const containsText = curry((str, test) => (str.indexOf(test) > -1))

const apply = curry((f, xs) => f(...xs))

const isEmpty = (xs) => (xs.length === 0)

const unfold = (f, seed) => {
    let pair = f(seed)
    let xs = []

    do {
        xs[xs.length] = pair[0]
        pair = f(pair[1])
    } while (pair !== false)

    return xs
}

const merge = curry((obj1, obj2) => Object.assign({}, obj1, obj2))

const mergeAll = (objs) => reduce(merge, {}, objs)

const concat = curry((xs, ys) => ys.concat(xs))

const join = curry((sep, xs) => {
    let s = ''
    let idx = 0

    while (idx < xs.length) {
        s += xs[idx] + (idx === xs.length - 1 ? '' : sep)
        idx += 1
    }

    return s
})

const prop = curry((name, obj) => obj[name])

const mapObj = curry((f, obj) => reduce((acc, key) => {
    acc[key] = f(obj[key], key, obj)
    return acc
}, {}, Object.keys(obj)))

const is = curry((type, obj) => (obj instanceof type))

const isNil = (value) => value === null || value === undefined

const split = curry((sep, str) => str.split(sep))

const clamp = curry((min, max, val) => Math.max(Math.min(max, val), min))

const noop = () => {}

const all = (pred, xs) => {
    let res = true
    let idx = 0

    while (idx < xs.length) {
        res = res && pred(xs[idx])
        idx += 1
    }

    return res
}

const any = (pred, xs) => {
    let res = false
    let idx = 0

    while (idx < xs.length) {
        res = res || pred(xs[idx])
        idx += 1
    }

    return res
}

const sortBy = curry((sorter, xs) => xs.sort((a, b) => {
    const aa = sorter(a)
    const bb = sorter(b)

    return aa < bb ? -1 : aa > bb ? 1 : 0
}))

const clone = (xs) => {
    let idx = 0
    let ys = []

    while (idx < xs.length) {
        ys[idx] = xs[idx]
        idx += 1
    }

    return ys
}

const pluralise = (value, single, plural) => (value === 1) ? single : plural

const isBetween = curry((start, end, value) => (value >= start && value <= end))

const replace = curry((search, replacement, value) => value.replace(search, replacement))

const fst = (pair) => pair[0]

const snd = (pair) => pair[1]

const toPairs = (obj) => map((key) => [key, obj[key]], Object.keys(obj))

const fromPairs = reduce((acc, item) => {
    acc[item[0]] = item[1]
    return acc
}, {})

export {
    curry,
    compose,
    map,
    mapObj,
    reduce,
    reduceRight,
    filter,
    count,
    repeat,
    find,
    findIterator,
    exists,
    reject,
    forEach,
    append,
    prepend,
    equals,
    contains,
    containsText,
    apply,
    flatten,
    concat,
    head,
    tail,
    init,
    last,
    reverse,
    flip,
    isEmpty,
    unfold,
    merge,
    mergeAll,
    join,
    prop,
    is,
    isNil,
    split,
    clamp,
    noop,
    all,
    any,
    sortBy,
    clone,
    pluralise,
    isBetween,
    replace,
    fst,
    snd,
    toPairs,
    fromPairs
}