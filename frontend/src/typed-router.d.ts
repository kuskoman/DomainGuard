/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/domains/[id]': RouteRecordInfo<'/domains/[id]', '/domains/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/domains/add': RouteRecordInfo<'/domains/add', '/domains/add', Record<never, never>, Record<never, never>>,
    '/user/login': RouteRecordInfo<'/user/login', '/user/login', Record<never, never>, Record<never, never>>,
    '/user/profile': RouteRecordInfo<'/user/profile', '/user/profile', Record<never, never>, Record<never, never>>,
    '/user/register': RouteRecordInfo<'/user/register', '/user/register', Record<never, never>, Record<never, never>>,
  }
}
