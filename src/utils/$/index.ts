import typeOf from './typeOf';
import isType from './isType';
import element from './element';
import { encrypt, decrypt } from './crypto';
import storage from './storage';
import * as operation from './operation';
import scroll from './scroll';

export const $ = {
  typeOf,
  isType,
  element,
  encrypt,
  decrypt,
  storage,
  operation,
  scroll
}

export default $