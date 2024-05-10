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

import { removeComponent, setComponent } from '@etherealengine/ecs'
import { defineQuery } from '@etherealengine/ecs/src/QueryFunctions'
import { defineSystem } from '@etherealengine/ecs/src/SystemFunctions'
import { AnimationSystemGroup } from '@etherealengine/ecs/src/SystemGroups'
import { HighlightComponent } from '@etherealengine/spatial/src/renderer/components/HighlightComponent'
import { useEffect } from 'react'
import { SelectionState } from '../services/SelectionServices'

export const highlightQuery = defineQuery([HighlightComponent])

const reactor = () => {
  const selectedEntities = SelectionState.useSelectedEntities()

  for (const entity of highlightQuery()) removeComponent(entity, HighlightComponent)

  useEffect(() => {
    if (!selectedEntities) return
    const lastSelection = selectedEntities[selectedEntities.length - 1]
    if (!lastSelection) return
    setComponent(lastSelection, HighlightComponent)
  }, [selectedEntities])

  return null
}

export const HighlightSystem = defineSystem({
  uuid: 'ee.editor.HighlightSystem',
  insert: { with: AnimationSystemGroup },
  reactor
})
