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

import { UserID } from '@etherealengine/common/src/schema.type.module'
import {
  Engine,
  EntityUUID,
  UUIDComponent,
  getComponent,
  getOptionalComponent,
  removeComponent,
  setComponent
} from '@etherealengine/ecs'
import { defineAction, defineState, getMutableState, getState, none, useHookstate } from '@etherealengine/hyperflux'
import { NetworkObjectComponent, NetworkTopics, WorldNetworkAction, matchesUserID } from '@etherealengine/network'
import React, { useEffect } from 'react'
import { MathUtils } from 'three'
import { TransformComponent } from '../../SpatialModule'
import { ComputedTransformComponent } from '../../transform/components/ComputedTransformComponent'
import { CameraComponent } from '../components/CameraComponent'
import { FlyControlComponent } from '../components/FlyControlComponent'

export class SpectateActions {
  static spectateEntity = defineAction({
    type: 'ee.engine.Engine.SPECTATE_USER' as const,
    spectatorUserID: matchesUserID,
    spectatingUserID: matchesUserID.optional(),
    $topic: NetworkTopics.world
  })

  static exitSpectate = defineAction({
    type: 'ee.engine.Engine.EXIT_SPECTATE' as const,
    spectatorUserID: matchesUserID,
    $topic: NetworkTopics.world
  })
}

export const SpectateEntityState = defineState({
  name: 'SpectateEntityState',
  initial: {} as Record<UserID, { spectating?: UserID }>,

  receptors: {
    onSpectateUser: SpectateActions.spectateEntity.receive((action) => {
      getMutableState(SpectateEntityState)[action.spectatorUserID].set({
        spectating: action.spectatingUserID as UserID | undefined
      })
    }),
    onEntityDestroy: WorldNetworkAction.destroyEntity.receive((action) => {
      if (getState(SpectateEntityState)[action.entityUUID]) {
        getMutableState(SpectateEntityState)[action.entityUUID].set(none)
      }
      for (const spectatorUserID in getState(SpectateEntityState)) {
        if (getState(SpectateEntityState)[spectatorUserID].spectating === action.entityUUID) {
          getMutableState(SpectateEntityState)[spectatorUserID].set(none)
        }
      }
    }),
    onExitSpectate: SpectateActions.exitSpectate.receive((action) => {
      getMutableState(SpectateEntityState)[action.spectatorUserID].set(none)
    })
  },

  reactor: () => {
    const state = useHookstate(getMutableState(SpectateEntityState))

    if (!state.value[Engine.instance.userID]) return null

    return <SpectatorReactor />
  }
})

const SpectatorReactor = () => {
  const state = useHookstate(getMutableState(SpectateEntityState)[Engine.instance.userID])

  useEffect(() => {
    const cameraEntity = Engine.instance.viewerEntity

    if (state.spectating.value) {
      const cameraTransform = getComponent(cameraEntity, TransformComponent)
      const networkCameraEntity = NetworkObjectComponent.getOwnedNetworkObjectWithComponent(
        state.spectating.value,
        CameraComponent
      )
      setComponent(cameraEntity, ComputedTransformComponent, {
        referenceEntities: [networkCameraEntity],
        computeFunction: () => {
          const networkTransform = getOptionalComponent(networkCameraEntity, TransformComponent)
          if (!networkTransform) return
          cameraTransform.position.copy(networkTransform.position)
          cameraTransform.rotation.copy(networkTransform.rotation)
        }
      })
      return () => {
        removeComponent(cameraEntity, ComputedTransformComponent)
      }
    } else {
      setComponent(cameraEntity, FlyControlComponent, {
        boostSpeed: 4,
        moveSpeed: 4,
        lookSensitivity: 5,
        maxXRotation: MathUtils.degToRad(80)
      })
      return () => {
        removeComponent(cameraEntity, FlyControlComponent)
      }
    }
  }, [state.spectating])

  if (!state.spectating.value) return null

  return <SpectatingUserReactor key={state.spectating.value} userID={state.spectating.value} />
}

const SpectatingUserReactor = (props: { userID: UserID }) => {
  /** @todo reevaluate if we should use the _camera suffix */
  const networkCameraEntity = UUIDComponent.useEntityByUUID((props.userID + '_camera') as EntityUUID)

  useEffect(() => {
    if (!networkCameraEntity) return

    const cameraEntity = Engine.instance.viewerEntity
    const cameraTransform = getComponent(cameraEntity, TransformComponent)
    setComponent(cameraEntity, ComputedTransformComponent, {
      referenceEntities: [networkCameraEntity],
      computeFunction: () => {
        const networkTransform = getOptionalComponent(networkCameraEntity, TransformComponent)
        if (!networkTransform) return
        cameraTransform.position.copy(networkTransform.position)
        cameraTransform.rotation.copy(networkTransform.rotation)
      }
    })
    return () => {
      removeComponent(cameraEntity, ComputedTransformComponent)
    }
  }, [networkCameraEntity])

  return null
}