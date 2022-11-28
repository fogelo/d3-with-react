import React from "react";
import "./App.css";
import ChartWidget1 from "./components/chart1/ChartWidget";
import ChartWidget2 from "./components/chart2/ChartWidget";

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <ChartWidget1/>
                {/*<ChartWidget2/>*/}
            </header>
        </div>
    );
}

export default App;
