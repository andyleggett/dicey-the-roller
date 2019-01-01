const visitDepth = (fn, tree, level = 0) => {
    fn(tree, level)
    if (tree.children && tree.children.length > 0) {
        forEach((child) => visitDepth(fn, child, level + 1), tree.children)
    }
}