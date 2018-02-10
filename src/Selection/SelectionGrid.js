import React from 'react';
import PropTypes from 'prop-types'

const MemberSelection = ({ member, onClick, style }) => (
  <SelectionButton onClick={onClick} style={style}>
    {member.fullName}
  </SelectionButton>
)

const SurnameRangeSelection = () => (
)

const ProductSelection = ({ product, onClick }) => (
  <SelectionButton style={{ background: `url(${product.image})` `}}>
    {product.name}
  </SelectionButton>
)

const SelectionButton = ({ children, style, onClick }) => (
  <button onClick={e => {
      e.preventDefault();
      onClick()
  }}, style={style}>
    {children}
  </button>
)


SelectionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
  style: PropTypes.object.isOptional
}

const SelectionGrid = ({ children}) => (
  <div style={{ display: 'grid' }}>
    {children}
  </div>
)

export default SelectionGrid;
