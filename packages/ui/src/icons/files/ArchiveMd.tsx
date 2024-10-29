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

import type { SVGProps } from 'react'
import * as React from 'react'
import { Ref, forwardRef } from 'react'
const ArchiveMd = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    role="img"
    stroke="currentColor"
    ref={ref}
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M3.333 6.664a2 2 0 0 1-.325-.03 1.67 1.67 0 0 1-1.31-1.309c-.032-.16-.032-.354-.032-.742 0-.387 0-.58.032-.741a1.67 1.67 0 0 1 1.31-1.31c.16-.032.354-.032.741-.032h12.5c.388 0 .581 0 .742.032a1.67 1.67 0 0 1 1.31 1.31c.032.16.032.354.032.741 0 .388 0 .581-.032.742a1.67 1.67 0 0 1-1.31 1.31c-.09.017-.188.025-.325.029m-8.333 4.17h3.333M3.333 6.666h13.333V13.5c0 1.4 0 2.1-.273 2.635a2.5 2.5 0 0 1-1.092 1.092c-.535.273-1.235.273-2.635.273H7.333c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 0 1-1.093-1.092c-.272-.535-.272-1.235-.272-2.635z"
    />
  </svg>
)
const ForwardRef = forwardRef(ArchiveMd)
export default ForwardRef