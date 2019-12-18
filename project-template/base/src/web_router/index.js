import {isArray, isEmpty, compact} from 'lodash';

let routes = [];
let pkgs = [];

function importAll(r) {
    r.keys().forEach(key => {
        let route = r(key).default;
        let pkg = r(key).pkg;
        if (isArray(route)) routes = routes.concat(compact(route).map(r => ({
            exact: true,
            strict: false,
            unrestricted: false,
            ...r
        })));
        if (!isEmpty(pkg)) pkgs.push(pkg);
    });
}

importAll(require.context('./', true, /index\.js$/));


routes.forEach((o, i) => {
    o.key = `route${i}-${o.path}`
});

export default routes;
export {routes, pkgs};
