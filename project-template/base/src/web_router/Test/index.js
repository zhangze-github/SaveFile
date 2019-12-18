import React, {Component} from 'react';
// import {Loadable} from 'bqs';
import Loadable from 'react-loadable';
import Loading from './Loading';
// import FunctionLoader from './One/Index';

// import DocsLoader from './Three';

const FunctionLoader = () => import('./One/Index' /* webpackChunkName: "one" */);
const TwoLoader = () => import('./Two/Index' /* webpackChunkName: "two" */);
const DocsLoader = () => import('./Three/Index' /* webpackChunkName: "three" */);
const FaqLoader = () => import('./Four/Index' /* webpackChunkName: "four" */);
const FiveLoader = () => import('./Five/Index' /* webpackChunkName: "five" */);

const routes = [
    {
        path: "/test/one",
        // component: FunctionLoader
        component: Loadable({
            loader: FunctionLoader,
            loading: Loading
        })
    },
    {
        path: "/test/two",
        // component: GuideLoader
        component: Loadable({
            loader: TwoLoader,
            loading: Loading
        })
    },
    {
        path: "/test/three",
        // component: DocsLoader
        component: Loadable({
            loader: DocsLoader,
            loading: Loading,
            // delay: 100,
            // timeout: 30000, // 30 seconds
        })
    },
    {
        path: "/test/four",
        // component: FaqLoader
        component: Loadable({
            loader: FaqLoader,
            loading: Loading
        })
    },
    {
        path: "/test/five",
        // component: FiveLoader
        component: Loadable({
            loader: FiveLoader,
            loading: Loading
        })
    }
];

export default routes;
// export pkg from './package.json';


