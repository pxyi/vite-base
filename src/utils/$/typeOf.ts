import { Type } from "./_type";

export default (data: any): Type => {
  let type = Object.prototype.toString.call(data)
  return type.substr(8, type.length - 9).toLocaleLowerCase() as Type;
}