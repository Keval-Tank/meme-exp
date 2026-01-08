import React from 'react'
import VisualsInput from '@/components/VisualsInput'
import RouteSwitcher from '@/components/RouteSwitcher'

const page = () => {
  return (
    <div>
        <RouteSwitcher/>
        <VisualsInput/>
    </div>
  )
}

export default page