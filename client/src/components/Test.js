import { useEffect, useState } from "react";

function Test() {
  const [themes, setThemes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        '/themes',
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const json = await response.json();
      setThemes(json)
    }
    fetchData();
  }, []);

  return (
    <div className="Test">
      <p>This is a test component</p>
    </div>
  )
}

export default Test;
