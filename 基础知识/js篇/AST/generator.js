class Generator {
    run (body) {
        let str = '';
        str += this.visitNodes(body);
        return str;
    }
    // 遍历节点
    visitNodes(nodes) {
        let str = '';
        for (const node of nodes) {
            str += this.visitNode(node);
        }
        return str;
    }

    visitNode(node) {
        let str = '';
        switch (node.type) {
            case 'VariableDeclaration':
                str += this.visitVariableDeclaration(node);
                break;
            case 'VariableDeclarator':
                str += this.visitVariableDeclarator(node);
                break;
            case 'Literal':
                str += this.visitLiteral(node);
                break;
            case 'Identifier':
                str += this.visitIdentifier(node);
                break;
            case 'BinaryExpression':
                str += this.visitBinaryExpression(node);
                break;
            case 'FunctionDeclaration':
                str += this.visitFunctionDeclaration(node);
                break;
            case 'BlockStatement':
                str += this.visitBlockStatement(node);
                break;
            case 'CallExpression':
                str += this.visitCallExpression(node);
                break;
            case 'ReturnStatement':
                str += this.visitReturnStatement(node);
                break;
            case 'ExpressionStatement':
                str += this.visitExpressionStatement(node);
                break;
        }
        return str;
    }

    // 处理变量声明
    visitVariableDeclaration(node) {
        let str = '';
        str += node.kind + ' ';
        str += this.visitNodes(node.declarations);
        return str + '\n';
    }

    // 处理接收到父节点的kind
    visitVariableDeclarator(node, kind) {
        let str = kind ? (kind + ' ') : '';
        str += this.visitNode(node.id);
        str += '=';
        str += this.visitNode(node.init);
        return str + ';' + '\n';
    }
}
