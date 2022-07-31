import React from 'react'
import ButtonAppBar from '../components/Header/Header'

export default ({ children }) => (
  <React.Fragment>
    <ButtonAppBar title="none" transparent dark />
    {children}
  </React.Fragment>
)