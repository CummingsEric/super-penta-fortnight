import { useState } from 'react';

const LeagueDataDisplay = () => {
  const [money, setMoney] = useState(400);

  const getData = () => {
    console.log('making data request');
    window.electron.ipcRenderer.sendMessage('get-league-data', ['request']);
    setTimeout(getData, 5000);
  };

  window.electron.ipcRenderer.once('get-league-data', (arg) => {
    // eslint-disable-next-line no-console
    console.log(arg);
    if (arg != null) {
      setMoney(arg.activePlayer.currentGold);
    }
  });

  return (
    <div>
      <button type="button" onClick={getData}>
        this button should do something
      </button>
      <h1>{money}</h1>
    </div>
  );
};

export default LeagueDataDisplay;
