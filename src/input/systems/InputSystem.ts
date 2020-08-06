import { System } from "ecsy"
import Input from "../components/Input"
import { DefaultInputSchema } from "../defaults/DefaultInputSchema"
import { Entity } from "ecsy"
import { NumericalType, Binary } from "../../common/types/NumericalTypes"
import Behavior from "../../common/interfaces/Behavior"
import InputValue from "../interfaces/InputValue"
import InputAlias from "../types/InputAlias"
import { InputType } from "../enums/InputType"
import LifecycleValue from "../../common/enums/LifecycleValue"

export default class InputSystem extends System {
  // Temp/ref variables
  private _inputComponent: Input
  // bound DOM listeners should be saved, otherwise they can't be unbound, becouse (f => f) !== (f => f)
  private boundListeners = new Set()

  public execute(delta: number): void {
    // Called every frame on all input components
    this.queries.inputs.results.forEach(entity => handleInput(entity, { delta }))

    // Called when input component is added to entity
    this.queries.inputs.added.forEach(entity => {
      // Get component reference
      this._inputComponent = entity.getComponent(Input)
      // If input doesn't have a map, set the default
      if (this._inputComponent.schema === undefined) this._inputComponent.schema = DefaultInputSchema
      // Call all behaviors in "onAdded" of input map
      this._inputComponent.schema.onAdded.forEach(behavior => {
        behavior.behavior(entity, { ...behavior.args })
      })
      // Bind DOM events to event behavior
      const {eventBindings} = this._inputComponent.schema
      if( eventBindings ) this.boundListeners[ entity.id ] =
        Object.entries(eventBindings).map( ([eventName, {behavior, args, selector}]) => {
          const domElement = selector ? document.querySelector(selector) : document
          if( domElement ){
            const listener = (event: Event) => behavior(entity, { event, ...args })
            domElement.addEventListener(eventName, listener)
            return [selector, eventName, listener]
          } else {
            console.warn("DOM Element not found:", selector)
            return false
          }
        }).filter(Boolean)
    })

    // Called when input component is removed from entity
    this.queries.inputs.removed.forEach(entity => {
      // Get component reference
      this._inputComponent = entity.getComponent(Input)
      // Call all behaviors in "onRemoved" of input map
      this._inputComponent.schema.onRemoved.forEach(behavior => {
        behavior.behavior(entity, behavior.args)
      })
      // Unbind events from DOM
      const bound = this.boundListeners[ entity.id ]
      if( bound ){
        for(const [selector, eventName, listener] of bound){
          const domElement = selector ? document.querySelector(selector) : document
          domElement?.removeEventListener(eventName, listener)
        }
        delete this.boundListeners[ entity.id ]
      }
    })
  }
}

let input: Input
export const handleInput: Behavior = (entity: Entity, args: { delta: number }): void => {
  input = entity.getComponent(Input)

  input.data.forEach((value: InputValue<NumericalType>, key: InputAlias) => {
    // If the input is a button
    if (value.type === InputType.BUTTON) {
      // If the input exists on the input map (otherwise ignore it)
      if (input.schema.inputButtonBehaviors[key] && input.schema.inputButtonBehaviors[key][value.value as number]) {
        // If the lifecycle hasn't been set or just started (so we don't keep spamming repeatedly)
        if (value.lifecycleState === undefined || value.lifecycleState === LifecycleValue.STARTED) {
          // Set the value of the input to continued to debounce
          input.data.set(key, {
            type: value.type,
            value: value.value as Binary,
            lifecycleState: LifecycleValue.CONTINUED
          })
          // Call the behavior with args
          input.schema.inputButtonBehaviors[key][value.value as number].behavior(
            entity,
            input.schema.inputButtonBehaviors[key][value.value as number].args,
            args.delta
          )
        }
      }
      // Otherwise, if the input type is an axis, i.e. not a button
    } else if (value.type === InputType.ONED || value.type === InputType.TWOD || value.type === InputType.THREED) {
      // If the key exists in the map, otherwise ignore it
      if (input.schema.inputAxisBehaviors[key]) {
        // If the lifecycle vawlue hasn't been set to continue
        if (value.lifecycleState === undefined || value.lifecycleState === LifecycleValue.STARTED) {
          // Set the value to continued to debounce
          input.data.set(key, {
            type: value.type,
            value: value.value as Binary,
            lifecycleState: LifecycleValue.CONTINUED
          })
          // Call the behavior with args
          input.schema.inputAxisBehaviors[key].behavior(entity, input.schema.inputAxisBehaviors[key].args, args.delta)
        }
      }
    } else {
      console.error("handleInput called with an invalid input type")
    }
  })
  input.data.clear()
}

InputSystem.queries = {
  inputs: {
    components: [Input],
    listen: {
      added: true,
      removed: true
    }
  }
}
