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

import { RigidBodyType, ShapeType } from '@dimforge/rapier3d-compat'
import assert from 'assert'
import { Vector3 } from 'three'

import { getComponent, removeComponent, setComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { destroyEngine } from '@etherealengine/ecs/src/Engine'
import { createEntity } from '@etherealengine/ecs/src/EntityFunctions'
import { getMutableState, getState } from '@etherealengine/hyperflux'
import { ObjectDirection } from '../../common/constants/MathConstants'
import { createEngine } from '../../initializeEngine'
import { TransformComponent } from '../../transform/components/TransformComponent'
import { computeTransformMatrix } from '../../transform/systems/TransformSystem'
import { ColliderComponent } from '../components/ColliderComponent'
import { CollisionComponent } from '../components/CollisionComponent'
import {
  RigidBodyComponent,
  RigidBodyFixedTagComponent,
  getTagComponentForRigidBody
} from '../components/RigidBodyComponent'
import { TriggerComponent } from '../components/TriggerComponent'
import { AllCollisionMask, CollisionGroups, DefaultCollisionMask } from '../enums/CollisionGroups'
import { getInteractionGroups } from '../functions/getInteractionGroups'
import { PhysicsState } from '../state/PhysicsState'
import { handlePhysicsEnterExitQueries } from '../systems/PhysicsSystem'
import { BodyTypes, ColliderDescOptions, CollisionEvents, SceneQueryType, Shapes } from '../types/PhysicsTypes'
import { Physics } from './Physics'

export const boxDynamicConfig = {
  shapeType: ShapeType.Cuboid,
  bodyType: RigidBodyType.Fixed,
  collisionLayer: CollisionGroups.Default,
  collisionMask: DefaultCollisionMask | CollisionGroups.Avatars | CollisionGroups.Ground,
  friction: 1,
  restitution: 0,
  isTrigger: false,
  spawnPosition: new Vector3(0, 0.25, 5),
  spawnScale: new Vector3(0.5, 0.25, 0.5)
} as ColliderDescOptions

describe('Physics', () => {
  beforeEach(async () => {
    createEngine()
    await Physics.load()
    const physicsWorld = Physics.createWorld()
    getMutableState(PhysicsState).physicsWorld.set(physicsWorld)
    physicsWorld.timestep = 1 / 60
  })

  afterEach(() => {
    return destroyEngine()
  })

  it('should create rapier world & event queue', async () => {
    const world = Physics.createWorld()
    const eventQueue = Physics.createCollisionEventQueue()
    assert(world)
    assert(eventQueue)
  })

  it('should create & remove rigidBody', async () => {
    const physicsWorld = getState(PhysicsState).physicsWorld

    const entity = createEntity()
    setComponent(entity, TransformComponent)
    setComponent(entity, RigidBodyComponent, { type: BodyTypes.Dynamic })
    setComponent(entity, ColliderComponent, { shape: Shapes.Sphere })
    handlePhysicsEnterExitQueries(physicsWorld)

    assert.deepEqual(physicsWorld.bodies.len(), 1)
    assert.deepEqual(physicsWorld.colliders.len(), 1)

    removeComponent(entity, RigidBodyComponent)
    handlePhysicsEnterExitQueries(physicsWorld)

    assert.deepEqual(physicsWorld.bodies.len(), 0)
  })

  it('component type should match rigid body type', async () => {
    const entity = createEntity()

    setComponent(entity, TransformComponent)
    setComponent(entity, RigidBodyComponent, { type: BodyTypes.Fixed })
    setComponent(entity, ColliderComponent, { shape: Shapes.Sphere })

    const rigidBodyComponent = getTagComponentForRigidBody(BodyTypes.Fixed)
    assert.deepEqual(rigidBodyComponent, RigidBodyFixedTagComponent)
  })

  // it('should create collider desc from input config data', async () => {
  //   const geometry = new BoxGeometry(1, 1, 1)
  //   const material = new MeshBasicMaterial()
  //   const mesh = new Mesh(geometry, material)
  //   mesh.translateX(10)
  //   mesh.rotateX(3.1415918)
  //   mesh.updateMatrixWorld(true)

  //   const collisionGroup = 0x0001
  //   const collisionMask = 0x0003
  //   boxDynamicConfig.collisionLayer = collisionGroup
  //   boxDynamicConfig.collisionMask = collisionMask
  //   boxDynamicConfig.isTrigger = true

  //   const boxColliderDesc = Physics.createColliderDescFromMesh(mesh, boxDynamicConfig)!
  //   const interactionGroups = getInteractionGroups(collisionGroup, collisionMask)

  //   assert.deepEqual(boxColliderDesc.shape.type, boxDynamicConfig.shapeType)
  //   assert.deepEqual(boxColliderDesc.collisionGroups, interactionGroups)
  //   assert.deepEqual(boxColliderDesc.isSensor, boxDynamicConfig.isTrigger)
  //   assert.deepEqual(boxColliderDesc.friction, boxDynamicConfig.friction)
  //   assert.deepEqual(boxColliderDesc.restitution, boxDynamicConfig.restitution)
  //   assert.deepEqual(boxColliderDesc.activeEvents, ActiveEvents.COLLISION_EVENTS)
  //   assert.deepEqual(boxColliderDesc.activeCollisionTypes, ActiveCollisionTypes.ALL)
  //   assert.deepEqual(boxColliderDesc.translation.x, 0)
  //   assert.deepEqual(boxColliderDesc.translation.y, 0)
  //   assert.deepEqual(boxColliderDesc.translation.z, 0)
  //   assert.deepEqual(boxColliderDesc.rotation.x, 0)
  //   assert.deepEqual(boxColliderDesc.rotation.y, 0)
  //   assert.deepEqual(boxColliderDesc.rotation.z, 0)
  //   assert.deepEqual(boxColliderDesc.rotation.w, 1)
  // })

  // it('should create collider desc from input config data in nested mesh', async () => {
  //   const geometry = new BoxGeometry(1, 1, 1)
  //   const material = new MeshBasicMaterial()
  //   const root = new Mesh(geometry, material)
  //   const mesh = new Mesh(geometry, material)
  //   root.add(mesh)
  //   mesh.position.set(1, 2, 3)
  //   mesh.rotateX(3.1415918)
  //   mesh.updateMatrixWorld(true)

  //   const collisionGroup = 0x0001
  //   const collisionMask = 0x0003
  //   boxDynamicConfig.collisionLayer = collisionGroup
  //   boxDynamicConfig.collisionMask = collisionMask
  //   boxDynamicConfig.isTrigger = true

  //   const boxColliderDesc = Physics.createColliderDescFromMesh(mesh, boxDynamicConfig, root)!
  //   const interactionGroups = getInteractionGroups(collisionGroup, collisionMask)

  //   assert.deepEqual(boxColliderDesc.shape.type, boxDynamicConfig.shapeType)
  //   assert.deepEqual(boxColliderDesc.collisionGroups, interactionGroups)
  //   assert.deepEqual(boxColliderDesc.isSensor, boxDynamicConfig.isTrigger)
  //   assert.deepEqual(boxColliderDesc.friction, boxDynamicConfig.friction)
  //   assert.deepEqual(boxColliderDesc.restitution, boxDynamicConfig.restitution)
  //   assert.deepEqual(boxColliderDesc.activeEvents, ActiveEvents.COLLISION_EVENTS)
  //   assert.deepEqual(boxColliderDesc.activeCollisionTypes, ActiveCollisionTypes.ALL)
  //   assert.deepEqual(boxColliderDesc.translation.x, mesh.position.x)
  //   assert.deepEqual(boxColliderDesc.translation.y, mesh.position.y)
  //   assert.deepEqual(boxColliderDesc.translation.z, mesh.position.z)
  //   assert.deepEqual(boxColliderDesc.rotation.x, mesh.quaternion.x)
  //   assert.deepEqual(boxColliderDesc.rotation.y, mesh.quaternion.y)
  //   assert.deepEqual(boxColliderDesc.rotation.z, mesh.quaternion.z)
  //   assert.deepEqual(boxColliderDesc.rotation.w, mesh.quaternion.w)
  // })

  // it('should change rigidBody type', async () => {
  //   const physicsWorld = getState(PhysicsState).physicsWorld

  //   const entity = createEntity()
  //   setComponent(entity, TransformComponent)
  //   setComponent(entity, RigidBodyComponent, { type: BodyTypes.Dynamic })

  //   const rigidBodyDesc = RigidBodyDesc.dynamic()
  //   const colliderDesc = ColliderDesc.ball(1)

  //   const rigidBody = Physics.createRigidBody(entity, physicsWorld, rigidBodyDesc)
  //   physicsWorld.createCollider(colliderDesc, rigidBody)

  //   assert.deepEqual(physicsWorld.bodies.len(), 1)
  //   assert.deepEqual(rigidBody.bodyType(), RigidBodyType.Dynamic)

  //   Physics.setRigidBodyType(entity, BodyTypes.Fixed)
  //   assert.deepEqual(rigidBody.bodyType(), RigidBodyType.Fixed)
  // })

  it('should create accurate InteractionGroups', async () => {
    const collisionGroup = 0x0001
    const collisionMask = 0x0003
    const interactionGroups = getInteractionGroups(collisionGroup, collisionMask)

    assert.deepEqual(interactionGroups, 65539)
  })

  it('should cast ray and hit rigidbody', async () => {
    const physicsWorld = getState(PhysicsState).physicsWorld

    const entity = createEntity()
    setComponent(entity, TransformComponent, { position: new Vector3(10, 0, 0), scale: new Vector3(10, 10, 10) })
    computeTransformMatrix(entity)
    setComponent(entity, RigidBodyComponent, { type: BodyTypes.Fixed })
    setComponent(entity, ColliderComponent, {
      shape: Shapes.Box,
      collisionLayer: CollisionGroups.Default,
      collisionMask: DefaultCollisionMask
    })

    handlePhysicsEnterExitQueries(physicsWorld)
    physicsWorld.step()

    const raycastComponentData = {
      type: SceneQueryType.Closest,
      origin: new Vector3().set(0, 0, 0),
      direction: ObjectDirection.Right,
      maxDistance: 20,
      groups: getInteractionGroups(CollisionGroups.Default, CollisionGroups.Default)
    }
    const hits = Physics.castRay(physicsWorld, raycastComponentData)

    assert.deepEqual(hits.length, 1)
    assert.deepEqual(hits[0].normal.x, -1)
    assert.deepEqual(hits[0].distance, 5)
    assert.deepEqual((hits[0].body.userData as any)['entity'], entity)
  })

  it('should generate a collision event', async () => {
    const physicsWorld = getState(PhysicsState).physicsWorld

    const entity1 = createEntity()
    const entity2 = createEntity()
    setComponent(entity1, TransformComponent)
    setComponent(entity2, TransformComponent)

    setComponent(entity1, RigidBodyComponent, { type: BodyTypes.Dynamic })
    setComponent(entity2, RigidBodyComponent, { type: BodyTypes.Dynamic })
    setComponent(entity1, ColliderComponent, {
      shape: Shapes.Sphere,
      collisionLayer: CollisionGroups.Default,
      collisionMask: DefaultCollisionMask
    })
    setComponent(entity2, ColliderComponent, {
      shape: Shapes.Sphere,
      collisionLayer: CollisionGroups.Default,
      collisionMask: DefaultCollisionMask
    })

    handlePhysicsEnterExitQueries(physicsWorld)

    const collisionEventQueue = Physics.createCollisionEventQueue()
    const drainCollisions = Physics.drainCollisionEventQueue(physicsWorld)

    physicsWorld.step(collisionEventQueue)
    collisionEventQueue.drainCollisionEvents(drainCollisions)

    const rigidBody1 = Physics._Rigidbodies.get(entity1)!
    const rigidBody2 = Physics._Rigidbodies.get(entity2)!

    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodySelf, rigidBody1)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodyOther, rigidBody2)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeSelf, rigidBody1.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeOther, rigidBody2.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.type, CollisionEvents.COLLISION_START)

    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodySelf, rigidBody2)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodyOther, rigidBody1)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeSelf, rigidBody2.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeOther, rigidBody1.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.type, CollisionEvents.COLLISION_START)

    rigidBody2.setTranslation({ x: 0, y: 0, z: 15 }, true)

    physicsWorld.step(collisionEventQueue)
    collisionEventQueue.drainCollisionEvents(drainCollisions)

    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodySelf, rigidBody1)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodyOther, rigidBody2)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeSelf, rigidBody1.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeOther, rigidBody2.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.type, CollisionEvents.COLLISION_END)

    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodySelf, rigidBody2)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodyOther, rigidBody1)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeSelf, rigidBody2.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeOther, rigidBody1.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.type, CollisionEvents.COLLISION_END)
  })

  it('should generate a trigger event', async () => {
    const physicsWorld = getState(PhysicsState).physicsWorld

    const entity1 = createEntity()
    const entity2 = createEntity()

    setComponent(entity1, CollisionComponent)
    setComponent(entity2, CollisionComponent)

    setComponent(entity1, TransformComponent)
    setComponent(entity2, TransformComponent)

    setComponent(entity1, RigidBodyComponent, { type: BodyTypes.Dynamic })
    setComponent(entity2, RigidBodyComponent, { type: BodyTypes.Dynamic })
    setComponent(entity1, ColliderComponent, {
      shape: Shapes.Sphere,
      collisionLayer: CollisionGroups.Default,
      collisionMask: AllCollisionMask
    })
    setComponent(entity2, ColliderComponent, {
      shape: Shapes.Sphere,
      collisionLayer: CollisionGroups.Default,
      collisionMask: AllCollisionMask
    })
    setComponent(entity2, TriggerComponent)

    handlePhysicsEnterExitQueries(physicsWorld)

    const collisionEventQueue = Physics.createCollisionEventQueue()
    const drainCollisions = Physics.drainCollisionEventQueue(physicsWorld)

    physicsWorld.step(collisionEventQueue)
    collisionEventQueue.drainCollisionEvents(drainCollisions)

    const rigidBody1 = Physics._Rigidbodies.get(entity1)!
    const rigidBody2 = Physics._Rigidbodies.get(entity2)!

    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodySelf, rigidBody1)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodyOther, rigidBody2)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeSelf, rigidBody1.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeOther, rigidBody2.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.type, CollisionEvents.TRIGGER_START)

    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodySelf, rigidBody2)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodyOther, rigidBody1)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeSelf, rigidBody2.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeOther, rigidBody1.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.type, CollisionEvents.TRIGGER_START)

    rigidBody2.setTranslation({ x: 0, y: 0, z: 15 }, true)

    physicsWorld.step(collisionEventQueue)
    collisionEventQueue.drainCollisionEvents(drainCollisions)

    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodySelf, rigidBody1)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.bodyOther, rigidBody2)
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeSelf, rigidBody1.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.shapeOther, rigidBody2.collider(0))
    assert.equal(getComponent(entity1, CollisionComponent).get(entity2)?.type, CollisionEvents.TRIGGER_END)

    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodySelf, rigidBody2)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.bodyOther, rigidBody1)
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeSelf, rigidBody2.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.shapeOther, rigidBody1.collider(0))
    assert.equal(getComponent(entity2, CollisionComponent).get(entity1)?.type, CollisionEvents.TRIGGER_END)
  })
})
