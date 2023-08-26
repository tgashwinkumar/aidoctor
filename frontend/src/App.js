import "./styles/tailwind.output.css";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UIContext = createContext();
const DoctorContext = createContext();

const App = () => {
  const [url, setUrl] = useState("http://localhost:3001/api/fetchdata");

  const [ui, setUi] = useState([]);

  const [data, setData] = useState([]);

  const handleClick = () => {
    axios
      .get(url)
      .then((res) => {
        setData(data);
        setUi([
          ...ui,
          <DataTable
            data={res.data}
            keys={["crypto", "high_price", "low_price", "current_value"]}
          />,
        ]);
      })
      .catch((err) => {});
  };

  return (
    <UIContext.Provider value={[ui, setUi]}>
      <div className="w-screen h-screen bg-gray-200 flex justify-center">
        <div className="w-3/4 bg-white px-16 py-4">
          <h1 className="text-4xl font-bold mb-8">Application</h1>
          <div className="space-y-4 w-full mb-8">
            <div className="text-lg">Enter URL</div>
            <div className="flex space-x-4 items-center">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="text"
                placeholder="Enter URL"
                className="px-4 py-4 h-fit border-gray-300 border-2 rounded-lg w-2/3"
              />
              <button
                onClick={handleClick}
                className="w-fit px-8 rounded-lg hover:bg-green-700 p-4 text-lg font-semibold bg-green-600 text-white"
              >
                GET
              </button>
            </div>
          </div>
          <div className="space-y-4">{ui}</div>
        </div>
        <div className="w-1/4 bg-gray-200 border-l-gray-400 border-l-4 p-4">
          <h1 className="text-4xl font-bold text-gray-600">
            Your AI Doctor ✨
          </h1>
        </div>
      </div>
    </UIContext.Provider>
  );
};

export default App;

const ErrorLog = ({ error, type, action }) => {
  useEffect(() => {
    if (type === "key_mismatch")
      axios
        .post("http://localhost:7777/mismatch-keys/", { jsonData: action.data })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    else if (type === "cors_err")
      axios
        .post("http://localhost:7777/cors-error/", {})
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
  }, []);

  return (
    <div className="w-full border-lg border-red-400 border-2 p-2 rounded-lg">
      <div className="text-xl font-bold text-red-700">! Error</div>
      <div className="text-red-800">{error}</div>
    </div>
  );
};

const DataTable = ({ data, keys }) => {
  const [ui, setUi] = useContext(UIContext);

  useEffect(() => {
    data.forEach((row) => {
      keys.forEach((key) => {
        if (!row.hasOwnProperty(key)) {
          let el = ui.pop();
          setUi([
            ...ui,
            <ErrorLog
              type="key_mismatch"
              error={`Key Mismatch in data`}
              action={{ data }}
            />,
          ]);
        }
      });
    });
  }, []);

  return (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            {keys.map((key) => (
              <th className="px-4 py-2">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr>
              {keys.map((value) => (
                <td className="border px-4 py-2">{row[value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
