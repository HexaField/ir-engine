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

import React, { ReactNode } from 'react'
import Text from '../../../primitives/tailwind/Text'

const panelIconStyles = {
  color: 'var(--textColor)',
  marginRight: '6px',
  width: '18px'
}

const panelCheckboxStyles = {
  color: 'var(--textColor)',
  position: 'relative',
  padding: '0px'
}

const panelContainerStyles = {
  position: 'relative',
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  borderRadius: '4px',
  backgroundColor: 'var(--dockBackground)',
  overflow: 'hidden',
  userSelect: 'none'
}

const panelToolbarStyles = {
  display: 'flex',
  padding: '4px',
  height: '24px',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.2)'
}

const panelContentStyles = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden'
}

export const PanelIcon = ({ as: IconComponent, size = 12 }) => {
  return <IconComponent style={panelIconStyles} size={size} />
}

export const PanelTitle = ({ children }) => {
  return (
    <Text fontSize="sm" fontFamily="Figtree">
      {children}
    </Text>
  )
}

export const PanelCheckbox = ({ children }) => {
  return <div style={panelCheckboxStyles as React.CSSProperties}>{children}</div>
}

export const PanelDragContainer = ({ children }) => {
  return (
    <div className="inline-flex h-[26px] items-center justify-start gap-2.5 rounded-tl-[5px] rounded-tr-[5px] bg-zinc-900 px-4 py-1">
      {children}
    </div>
  )
}

export const PanelContainer = ({ children, ...rest }) => {
  return (
    <div style={panelContainerStyles as React.CSSProperties} {...rest}>
      {children}
    </div>
  )
}

export const PanelToolbar = ({ children }) => {
  return (
    <div className="toolbar" style={panelToolbarStyles}>
      {children}
    </div>
  )
}

export const PanelContent = ({ children }) => {
  return <div style={panelContentStyles as React.CSSProperties}>{children}</div>
}

interface PanelProps {
  icon?: React.ElementType
  title: string
  toolbarContent?: React.ReactNode
  children?: ReactNode
  // Add any other props you want to accept
}

const Panel: React.FC<PanelProps> = ({ icon, title, children, toolbarContent, ...rest }) => {
  return (
    <PanelContainer {...rest}>
      <PanelToolbar>
        {icon && <PanelIcon as={icon} size={12} />}
        <PanelTitle>{title}</PanelTitle>
        {toolbarContent}
      </PanelToolbar>
      <PanelContent>{children}</PanelContent>
    </PanelContainer>
  )
}

export default Panel
