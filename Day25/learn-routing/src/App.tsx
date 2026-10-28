import { useCallback, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  const sayHello = useCallback(() => {
    console.log("Hello bro!");
  }, []);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
      <button onClick={sayHello}>
        Say Hello
      </button>
    </div>
  );
}

export default App;