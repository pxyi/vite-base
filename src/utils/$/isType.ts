import typeOf from "./typeOf"
import { Type } from "./_type"

export default (data: any, type: Type): boolean => {
  return typeOf(data) === type;
}