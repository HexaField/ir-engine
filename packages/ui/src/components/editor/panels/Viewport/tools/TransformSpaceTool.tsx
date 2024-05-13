/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/EtherealEngine/etherealengine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Ethereal Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Ethereal Engine team.

All portions of the code written by the Ethereal Engine team are Copyright © 2021-2023 
Ethereal Engine. All Rights Reserved.
*/

import React from 'react'

import { TransformSpace } from '@etherealengine/engine/src/scene/constants/transformConstants'
import { getMutableState, useHookstate } from '@etherealengine/hyperflux'

import { setTransformSpace, toggleTransformSpace } from '@etherealengine/editor/src/functions/transformFunctions'
import { EditorHelperState } from '@etherealengine/editor/src/services/EditorHelperState'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { PiGlobeSimple } from 'react-icons/pi'
import Button from '../../../../../primitives/tailwind/Button'
import Select from '../../../../../primitives/tailwind/Select'

const transformSpaceOptions = [
  {
    label: t('editor:toolbar.transformSpace.lbl-selection'),
    description: t('editor:toolbar.transformSpace.info-selection'),
    value: TransformSpace.local
  },
  {
    label: t('editor:toolbar.transformSpace.lbl-world'),
    description: t('editor:toolbar.transformSpace.info-world'),
    value: TransformSpace.world
  }
]

const TransformSpaceTool = () => {
  const { t } = useTranslation()

  const transformSpace = useHookstate(getMutableState(EditorHelperState).transformSpace)

  return (
    <div id="transform-space" className="bg-theme-surfaceInput flex items-center">
      <Button
        startIcon={<PiGlobeSimple />}
        onClick={toggleTransformSpace}
        variant="transparent"
        title={t('editor:toolbar.transformSpace.lbl-toggleTransformSpace')}
        className="px-0"
      />
      {/* <Tooltip title={t('editor:toolbar.transformSpace.description')} direction='bottom'> */}
      <Select
        key={transformSpace.value}
        inputClassName="py-1 h-6 rounded-sm text-xs"
        className="w-24 p-1 text-[#A3A3A3]"
        onChange={setTransformSpace}
        options={transformSpaceOptions}
        value={transformSpace.value}
      />
      {/* </Tooltip> */}
    </div>
  )
}

export default TransformSpaceTool