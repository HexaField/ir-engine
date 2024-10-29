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
const LinkedinSquareFalse = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 48 48"
    role="img"
    stroke="currentColor"
    ref={ref}
    {...props}
  >
    <path
      fill="#080808"
      fillRule="evenodd"
      d="M48 0H0v48h48zM10.774 14.907a4.164 4.164 0 1 0 0-8.328 4.164 4.164 0 0 0 0 8.328m7.977 3.077h6.901v3.161S27.525 17.4 32.62 17.4c4.546 0 8.311 2.239 8.311 9.064v14.392H33.78V28.208c0-4.026-2.15-4.469-3.788-4.469-3.399 0-3.981 2.932-3.981 4.994v12.123h-7.26zm-4.347 0h-7.26v22.872h7.26z"
      clipRule="evenodd"
    />
  </svg>
)
const ForwardRef = forwardRef(LinkedinSquareFalse)
export default ForwardRef