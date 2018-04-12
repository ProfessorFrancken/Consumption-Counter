import React, { Component } from 'react';
import Grid from './Grid';
import './buixieval.css';

class Buixieval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({
      width: window.innerWidth - 230,
      height: window.innerHeight - 280,
      direction: window.innerWidth > window.innerHeight ? 'row' : 'col'
    });
  };

  splitBackers = backers => {
    const pink = backers.filter(backer => backer.buixieval.team === 'p');
    const blue = backers.filter(backer => backer.buixieval.team === 'b');

    const pinkTotal = pink.reduce(
      (total, backer) => total + backer.buixieval.contributed,
      0
    );
    const blueTotal = blue.reduce(
      (total, backer) => total + backer.buixieval.contributed,
      0
    );

    const total = pinkTotal + blueTotal;
    const pinkPartition = pinkTotal / total;

    const pinkWidth =
      this.state.direction === 'col'
        ? this.state.width
        : this.state.width * pinkPartition;
    const blueWidth =
      this.state.direction === 'col'
        ? this.state.width
        : this.state.width - pinkWidth;
    const pinkHeight =
      this.state.direction === 'row'
        ? this.state.height
        : this.state.height * pinkPartition;
    const blueHeight =
      this.state.direction === 'row'
        ? this.state.height
        : this.state.height - pinkHeight;

    return {
      pink,
      blue,
      pinkHeight,
      pinkWidth,
      blueHeight,
      blueWidth
    };
  };

  render() {
    const {
      pink,
      blue,
      pinkHeight,
      pinkWidth,
      blueHeight,
      blueWidth
    } = this.splitBackers(this.props.members);
    return (
      <div
        style={{
          width: this.state.width,
          height: this.state.height,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            display: this.state.direction === 'row' ? 'inline-block' : 'block',
            overflow: 'hidden'
          }}
        >
          <Grid
            selectMember={this.props.selectMember}
            backers={pink}
            width={pinkWidth}
            height={pinkHeight}
          />
        </div>
        <div
          style={{
            display: this.state.direction === 'row' ? 'inline-block' : 'block',
            overflow: 'hidden'
          }}
        >
          <Grid
            selectMember={this.props.selectMember}
            backers={blue}
            width={blueWidth}
            height={blueHeight}
          />
        </div>
      </div>
    );
  }
}

export default Buixieval;
