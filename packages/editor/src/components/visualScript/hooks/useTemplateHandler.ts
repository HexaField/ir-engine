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
import { Edge, Node } from 'reactflow'

import { getMutableState } from '@etherealengine/hyperflux'
import { GraphTemplate, VisualScriptState } from '@etherealengine/visual-script'
import { useHookstate } from '@hookstate/core'
import { uniqueId } from 'lodash'
import { useMemo } from 'react'
import { useSelectionHandler } from './useSelectionHandler'
import { useVisualScriptFlow } from './useVisualScriptFlow'

type selectionHandler = ReturnType<typeof useSelectionHandler>
type visualScriptFlow = ReturnType<typeof useVisualScriptFlow>

export const useTemplateHandler = ({
  selectedNodes,
  selectedEdges,
  pasteNodes,
  onNodesChange
}: Pick<selectionHandler, 'pasteNodes'> &
  Pick<visualScriptFlow, 'onNodesChange'> & {
    selectedNodes: Node[]
    selectedEdges: Edge[]
  }) => {
  const visualScriptState = useHookstate(getMutableState(VisualScriptState))

  const createGraphTemplate = (nodes: Node[], edges: Edge[]): GraphTemplate => ({
    id: self.crypto.randomUUID(),
    name: uniqueId('New template '),
    nodes,
    edges
  })

  const handleAddTemplate = useMemo(
    () =>
      (nodes: Node[] = selectedNodes, edges: Edge[] = selectedEdges) => {
        try {
          visualScriptState.templates.set((currentTemplates) => [
            ...currentTemplates,
            createGraphTemplate(nodes, edges)
          ])
        } catch (error) {
          console.error('Error adding template:', error)
        }
      },
    [selectedNodes, selectedEdges]
  )

  const handleEditTemplate = (editedTemplate: GraphTemplate) => {
    try {
      visualScriptState.templates.set((currentTemplates) => {
        const filterList = currentTemplates.filter((template) => template.id !== editedTemplate.id)
        return [...filterList, editedTemplate]
      })
    } catch (error) {
      console.error('Error editing template:', error)
    }
  }

  const handleDeleteTemplate = (deleteTemplate: GraphTemplate) => {
    try {
      visualScriptState.templates.set((currentTemplates) =>
        currentTemplates.filter((template) => template.id !== deleteTemplate.id)
      )
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleApplyTemplate = (template: GraphTemplate) => {
    try {
      console.log('DEBUG ', template.name)
      pasteNodes(template.nodes, template.edges, true, template.name)
    } catch (error) {
      console.error('Error applying template:', error)
    }
  }

  return { handleAddTemplate, handleEditTemplate, handleDeleteTemplate, handleApplyTemplate }
}
