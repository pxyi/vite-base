const clone = (data) => JSON.parse(JSON.stringify(data));

export default clone;


function isPrimitiveValue(value) {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    value == null ||
    typeof value === 'boolean' ||
    Number.isNaN(value)
  ) {
    return true
  }

  return false
}

// function cloneDeep(value) {
//   // 判断拷贝的数据类型，如果为原始类型数据，直接返回其值

//   if (isPrimitiveValue(value)) {
//     return value
//   }
//   // 定义一个保存引用类型的变量,根据 引用数据类型不同的子类型初始化不同的值，以下对象类型的判断和初始化可以根据自身功能的需要做删减。这里列出了所有的引用类型的场景。
//   let result

//   if (typeof value === 'function') {
//     // result=value 如果复制函数的时候需要保持同一个引用可以省去新函数的创建，这里用eval创建了一个原函数的副本
//     result = eval(`(${value.toString()})`)
//   } else if (Array.isArray(value)) {
//     result = []
//   } else if (value instanceof RegExp) {
//     result = new RegExp(value)
//   } else if (value instanceof Date) {
//     result = new Date(value)
//   } else if (value instanceof Number) {
//     result = new Number(value)
//   } else if (value instanceof String) {
//     result = new String(value)
//   } else if (value instanceof Boolean) {
//     result = new Boolean(value)
//   } else if (typeof value === 'object') {
//     result = new Object()
//   }

//   for (let key in value) {
//     if (value.hasOwnProperty(key)) {
//       try {
//         result[key] = cloneObject(value[key]) //属性值为原始类型包装对象的时候，（Number,String,Boolean）这里会抛错，需要加一个错误处理，对运行结果没有影响。
//       } catch (error) {
//         // console.error(error)
//       }
//     }
//   }

//   return result
// }