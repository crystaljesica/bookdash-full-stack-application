import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgb(90, 86, 80)',
    width: '100%'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right top, rgba(63, 81, 181, 0.7), rgba(25, 32, 72, 0.7))',
    backgroundSize: 'cover',
    backgroundPositionY: 'center'
  },
  content: {
    width: '90%'
  },
  small: {
    height: 240
  },
  medium: {
    height: 360
  },
  large: {
    height: 480
  },
  fullscreen: {
    height: '100vh'
  }
})

const Hero = props => {
  const { size, src, classes, children } = props
  const overlayStyle = src ? {
    backgroundImage: `url("${src}")`
  } : null
  
  return (
    <div className={`${classes.root} ${classes[size]}`}>
      <div className={classes.imageOverlay} style={overlayStyle}></div>
      <section className={classes.content}>
        {children}
      </section>
    </div>
  )
}

Hero.defaultProps = {
  size: 'medium'
}

Hero.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.string,
  src: PropTypes.string
}

export default withStyles(styles)(Hero)