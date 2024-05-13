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
import { MdOutlineHeatPump, MdOutlineWatch, MdOutlineWindPower } from 'react-icons/md'
import Select, { SelectProps } from '../../../../primitives/tailwind/Select'

// make new component instead

const SelectInput = ({ ...rest }: SelectProps<string | number>) => {
  return (
    <Select
      className="text-theme-primary h-10 w-72 bg-[#212226]"
      menuContainerClassName="border-none mt-0 rounded-none"
      inputClassName="rounded-none"
      {...rest}
    />
  )
}

SelectInput.displayName = 'SelectInput'
SelectInput.defaultProps = {
  options: [
    { label: 'Cuboid', value: 'a', icon: <MdOutlineWatch /> },
    { label: 'Cylinder', value: 'b', icon: <MdOutlineHeatPump /> },
    { label: 'Cube', value: 'c', icon: <MdOutlineWindPower /> }
  ],
  value: 'a',
  onChange: () => {}
}

export default SelectInput