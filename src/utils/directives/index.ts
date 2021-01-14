import PermissionsDirective from './permissions.directive';

let directives = [ 
  PermissionsDirective 
]

export default (app) => directives.map(d => app.directive(d.name, d))