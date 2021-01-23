import React from 'react';

const path = 'https://buixieval.nl/api';

const Backer = ({ width, height, backer, selectMember }) => {
  const className =
    backer.buixieval.team === 'bstuur'
      ? 'neutral'
      : backer.buixieval.team === 'p'
      ? 'pink'
      : 'blue';

  return (
    <div
      style={{
        width: width,
        height: height,
        background:
          'url(' +
          path +
          '/image/' +
          backer.buixieval.id +
          ') no-repeat center center',
        backgroundColor: backer.buixieval.team === 'p' ? '#FF09FF' : '#00FFFF',
        backgroundSize: 'cover',
        overflow: 'hidden'
      }}
      onClick={() => selectMember(backer)}
    >
      <div className={'overlay ' + className} />
    </div>
  );
};

export default Backer;
