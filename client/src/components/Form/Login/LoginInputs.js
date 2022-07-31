import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Fade from '@material-ui/core/Fade'

const styles = theme => ({
  absolute: {
    position: 'absolute',
    top: 45
  },
  input: {
    marginTop: theme.spacing.unit * 2
  },
  visibilityButton: {
    '&:hover': {
      background: 'transparent'
    }
  },
  hiddenField: {
    display: 'none'
  }
})

const renderField = ({
  input,
  label,
  type,
  name,
  placeholder,
  classes,
  endAdornment,
  meta: { touched, error }
}) => (
  <FormControl
    margin="normal"
    className={classes.input}
    fullWidth
    error={touched && !!error}
  >
    <InputLabel
      htmlFor={name}
    >
      {label}
    </InputLabel>
    <Input
      {...input}
      autoComplete={type === 'email' ? 'username' : null}
      id={name}
      type={type}
      placeholder={placeholder}
      endAdornment={endAdornment}
    />
    <Fade in={!!touched && !!error}>
      <FormHelperText className={classes.absolute}>
        {error}
      </FormHelperText>
    </Fade>
  </FormControl>
)

class SignupInputs extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  state = {
    showPassword: false
  }

  handleMouseDownPassword = event => {
    event.preventDefault();
  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    })
  }

  render () {
    const { classes } = this.props

    return [
      <Field
        key="email"
        classes={classes}
        name="email"
        component={renderField}
        type="email"
        label="Email"
        placeholder="jane@example.com"
      />,
      <input key="hidden" className={classes.hiddenField} />,
      <Field
        key="password"
        classes={classes}
        name="password"
        component={renderField}
        type={this.state.showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="RudabegaStew"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              tabIndex="-1"
              className={classes.visibilityButton}
              aria-label="Toggle password visibility"
              onClick={this.handleClickShowPassword}
              onMouseDown={this.handleMouseDownPassword}
            >
              {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    ]
  }
}

export default reduxForm({
  form: 'login'
})(withStyles(styles)(SignupInputs))
