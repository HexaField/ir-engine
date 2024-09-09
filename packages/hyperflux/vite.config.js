/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/ir-engine/ir-engine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Infinite Reality Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Infinite Reality Engine team.

All portions of the code written by the Infinite Reality Engine team are Copyright © 2021-2023 
Infinite Reality Engine. All Rights Reserved.
*/


// vite.config.js
import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      formats: ['es', 'cjs'],
      entry: resolve(__dirname, 'index.ts'),
      name: 'hyperflux',
      // the proper extensions will be added
      fileName: 'hyperflux'
    },
    rollupOptions: {
      external: [ // possibly use https://github.com/davidmyersdev/vite-plugin-externalize-deps/tree/main
        'react',
        'react-reconciler',
        'react-reconciler/constants',
        'ts-matches',
        'ts-toolbelt',
        'uuid',
        '@hookstate/core',
        '@hookstate/identifiable'
      ]
    }
  },
  plugins: [
    typescript({
      exclude: ['**/*.test.ts'],
      target: 'esnext',
      rootDir: resolve(__dirname, './src'),
      declaration: true,
      declarationDir: resolve(__dirname, './dist')
    })
  ]
})
