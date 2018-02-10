import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const LinkButton = ({to, children, className = ''}) => (
  <Link className={`btn btn-lg btn-outline-light ${className}`} to={to}>
    {children}
  </Link>
)

LinkButton.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default LinkButton;
