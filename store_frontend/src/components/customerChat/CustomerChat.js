import React from 'react';

const customerChat = () => {
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div
        style={{ margin: '1%', display: 'inline-block', width: '18%', height: '100%', backgroundColor: 'blue' }}
      ></div>
      <div style={{ margin: '1%', display: 'inline-block', width: '78%', height: '100%', backgroundColor: 'yellow' }}>
        <div style={{ display: 'block', width: '95%', margin: '2% auto', height: '80%', backgroundColor: 'red' }}></div>

        <div style={{ display: 'block', width: '95%', margin: '2% auto', height: '12%', backgroundColor: 'red' }}></div>
      </div>
    </div>
  );
};

export default customerChat;
