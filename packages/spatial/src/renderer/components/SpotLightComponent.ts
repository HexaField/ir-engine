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

import { useEffect } from 'react'
import {
  BufferGeometry,
  Color,
  ConeGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  SpotLight,
  TorusGeometry
} from 'three'

import { getMutableState, none, useHookstate } from '@etherealengine/hyperflux'

import { defineComponent, getComponent, setComponent, useComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { Entity } from '@etherealengine/ecs/src/Entity'
import { createEntity, removeEntity, useEntityContext } from '@etherealengine/ecs/src/EntityFunctions'
import { createObj, useObj } from '@etherealengine/engine/src/assets/functions/resourceHooks'
import { matches } from '@etherealengine/hyperflux'
import { EntityTreeComponent } from '@etherealengine/spatial/src/transform/components/EntityTree'
import { NameComponent } from '../../common/NameComponent'
import { mergeBufferGeometries } from '../../common/classes/BufferGeometryUtils'
import { isMobileXRHeadset } from '../../xr/XRState'
import { RendererState } from '../RendererState'
import { ObjectLayers } from '../constants/ObjectLayers'
import { useUpdateLight } from '../functions/useUpdateLight'
import { GroupComponent, addObjectToGroup, removeObjectFromGroup } from './GroupComponent'
import { setVisibleComponent } from './VisibleComponent'

const ringGeom = new TorusGeometry(0.1, 0.025, 8, 12)
const coneGeom = new ConeGeometry(0.25, 0.5, 8, 1, true)
coneGeom.translate(0, -0.25, 0)
coneGeom.rotateX(-Math.PI / 2)
const geom = mergeBufferGeometries([ringGeom, coneGeom])!
const helperMaterial = new MeshBasicMaterial({ fog: false, transparent: true, opacity: 0.5, side: DoubleSide })

export const SpotLightComponent = defineComponent({
  name: 'SpotLightComponent',
  jsonID: 'EE_spot_light',

  onInit: (entity) => {
    return {
      color: new Color(),
      intensity: 10,
      range: 0,
      decay: 2,
      angle: Math.PI / 3,
      penumbra: 1,
      castShadow: false,
      shadowBias: 0.00001,
      shadowRadius: 1,
      helperEntity: null as Entity | null
    }
  },

  onSet: (entity, component, json) => {
    if (!json) return
    if (matches.object.test(json.color) && json.color.isColor) component.color.set(json.color)
    if (matches.string.test(json.color) || matches.number.test(json.color)) component.color.value.set(json.color)
    if (matches.number.test(json.intensity)) component.intensity.set(json.intensity)
    if (matches.number.test(json.range)) component.range.set(json.range)
    if (matches.number.test(json.decay)) component.decay.set(json.decay)
    if (matches.number.test(json.angle)) component.angle.set(json.angle)
    if (matches.number.test(json.penumbra)) component.angle.set(json.penumbra)
    if (matches.boolean.test(json.castShadow)) component.castShadow.set(json.castShadow)
    /** backwards compat */
    if (matches.number.test(json.shadowBias)) component.shadowBias.set(json.shadowBias)
    if (matches.number.test(json.shadowRadius)) component.shadowRadius.set(json.shadowRadius)
  },

  toJSON: (entity, component) => {
    return {
      color: component.color.value,
      intensity: component.intensity.value,
      range: component.range.value,
      decay: component.decay.value,
      angle: component.angle.value,
      penumbra: component.penumbra.value,
      castShadow: component.castShadow.value,
      shadowBias: component.shadowBias.value,
      shadowRadius: component.shadowRadius.value
    }
  },

  reactor: function () {
    const entity = useEntityContext()
    const renderState = useHookstate(getMutableState(RendererState))
    const debugEnabled = renderState.nodeHelperVisibility
    const spotLightComponent = useComponent(entity, SpotLightComponent)
    const [light] = useObj(SpotLight, entity)

    useEffect(() => {
      if (isMobileXRHeadset) return
      light.target.position.set(1, 0, 0)
      light.target.name = 'light-target'
      addObjectToGroup(entity, light)
      return () => {
        removeObjectFromGroup(entity, light)
      }
    }, [])

    useEffect(() => {
      light.color.set(spotLightComponent.color.value)
      const helperEntity = spotLightComponent.helperEntity.value
      if (helperEntity) {
        const helper = getComponent(helperEntity, GroupComponent)[0] as any as Mesh<BufferGeometry, MeshBasicMaterial>
        helper.material.color.set(spotLightComponent.color.value)
      }
    }, [spotLightComponent.color])

    useEffect(() => {
      light.intensity = spotLightComponent.intensity.value
    }, [spotLightComponent.intensity])

    useEffect(() => {
      light.distance = spotLightComponent.range.value
    }, [spotLightComponent.range])

    useEffect(() => {
      light.decay = spotLightComponent.decay.value
    }, [spotLightComponent.decay])

    useEffect(() => {
      light.angle = spotLightComponent.angle.value
    }, [spotLightComponent.angle])

    useEffect(() => {
      light.penumbra = spotLightComponent.penumbra.value
    }, [spotLightComponent.penumbra])

    useEffect(() => {
      light.shadow.bias = spotLightComponent.shadowBias.value
    }, [spotLightComponent.shadowBias])

    useEffect(() => {
      light.shadow.radius = spotLightComponent.shadowRadius.value
    }, [spotLightComponent.shadowRadius])

    useEffect(() => {
      light.castShadow = spotLightComponent.castShadow.value
    }, [spotLightComponent.castShadow])

    useEffect(() => {
      if (light.shadow.mapSize.x !== renderState.shadowMapResolution.value) {
        light.shadow.mapSize.set(renderState.shadowMapResolution.value, renderState.shadowMapResolution.value)
        light.shadow.map?.dispose()
        light.shadow.map = null as any
        light.shadow.camera.updateProjectionMatrix()
        light.shadow.needsUpdate = true
      }
    }, [renderState.shadowMapResolution])

    useEffect(() => {
      if (!debugEnabled.value) return
      const [helper, unload] = createObj(Mesh, entity, geom, helperMaterial)
      helper.name = `spotlight-helper-${entity}`

      const helperEntity = createEntity()
      addObjectToGroup(helperEntity, helper)
      setComponent(helperEntity, NameComponent, helper.name)
      setComponent(helperEntity, EntityTreeComponent, { parentEntity: entity })
      setVisibleComponent(helperEntity, true)

      helper.layers.set(ObjectLayers.NodeHelper)

      spotLightComponent.helperEntity.set(helperEntity)

      return () => {
        removeEntity(helperEntity)
        spotLightComponent.helperEntity.set(none)
        unload()
      }
    }, [debugEnabled])

    useUpdateLight(light)

    return null
  }
})
