type Flag = 'Placement' | 'Deletion' // Placement需要移动的节点，Deletion需要删除的节点
interface Node {
    key: string // node唯一key
    flag?: Flag // node diff后的副作用
    index?: number // 索引位置
}

function diff (before: Node[], after:Node[]): Node[] {
    const result: Node[] = []

    const beforeMap = new Map<string, Node>();
    before.forEach((node, i)=> {
        node.index = i;
        beforeMap.set(node.key, node)
    })

    // 遍历到的最后一个可复用node在before中的index
    let lastPlacedIndex = 0;

    for (let i = 0; i < after.length;i++) {
        const afterNode = after[i]
        const beforeNode = beforeMap.get(afterNode.key)

        // 如果节点存在说明是老节点，移动位置即可
        if (beforeNode) {
            // 存在可复用node
            beforeMap.delete(beforeNode.key)

            const oldIndex = beforeNode.index
            if (oldIndex < lastPlacedIndex) {
                // 移动
                afterNode.flag = 'Placement'
                result.push(afterNode)
                continue
            } else {
                // 不移动
                lastPlacedIndex = oldIndex
            }
        } else {
            // 不存在可复用node，这是一个新节点
            afterNode.flag = 'Placement'
            result.push(afterNode)
        }

        beforeMap.forEach((node) => {
            node.flag = 'Deletion'
            result.push(node)
        })
    }

    return result
}