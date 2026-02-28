import React from 'react';

const Disk = ({ size, color }) => {
    const width = 40 + (size * 20);
    return (
        <div style={{
            width: `${width}px`,
            height: '20px',
            backgroundColor: color,
            borderRadius: '10px',
            margin: '2px auto',
            border: '1px solid white'
        }} />
    );
};

export default Disk;