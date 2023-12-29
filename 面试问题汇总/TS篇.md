## void 和 never区别
```ts
enum ShapeKind {
  Circle,
  Square,
}

interface Shape {
  kind: ShapeKind;
  radius?: number;
  sideLength?: number;
}

function getArea(shape: Shape) {
    switch (shape.kind) {
        case ShapeKind.Circle:
            return Math.PI * shape.radius ** 2;
        case ShapeKind.Square:
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape.kind; // (property) Shape.kind: never
            return _exhaustiveCheck;
    }
}
```
反向推到 走入`default`的必然是never因为只有never才能给never赋值，所以推导出`shape.kind`也是never，但
`shape.kind`类型为`Shape`所以永远不可能走入default当枚举穷举完时。

## 什么是泛型

