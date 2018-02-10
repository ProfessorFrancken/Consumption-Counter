import React from 'react'
import { Link } from 'react-router-dom'


const LinkButton = ({to, children}) => (
  <Link className="btn btn-outline-secondary" to={to}>
    {children}
  </Link>
)

LinkButton.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default LinkButton;
