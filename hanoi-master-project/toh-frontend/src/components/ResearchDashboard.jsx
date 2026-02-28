import React, { useState } from 'react';
import axios from 'axios';

const ResearchDashboard = ({ disks }) => {
    const [data, setData] = useState(null);

    const runBenchmark = async () => {
        const res = await axios.get(`http://localhost:8080/api/dsa/compare/${discs}`);
        setData(res.data);
    };

    return (
        <div className="research-panel">
            <h3>DSA Performance Metrics</h3>
            <button onClick={runBenchmark}>Run Benchmark (n={discs})</button>
            {data && (
                <div className="metrics-grid">
                    <div className="metric-card">
                        <h4>Recursive</h4>
                        <p>{data.recursiveNanoseconds.toLocaleString()} ns</p>
                    </div>
                    <div className="metric-card">
                        <h4>Iterative (Stack)</h4>
                        <p>{data.iterativeNanoseconds.toLocaleString()} ns</p>
                    </div>
                </div>
            )}
        </div>
    );
};