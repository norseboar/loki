import {useState} from 'react';

function useCounter() {
  const [count, setCount] = useState(0);

  function incrementCount() {
    setCount(count + 1);
  }

  function resetCount() {
    setCount(0);
  }

  return [count, incrementCount, resetCount];
}

export default useCounter;