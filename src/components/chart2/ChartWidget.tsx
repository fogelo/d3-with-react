import React, {useEffect, useState} from "react";
import useWindowDimensions from "./hooks/useWindowDimensions";

const ChartWidget = () => {
    console.log(333)

    const {height, width} = useWindowDimensions()

    console.log(444)

    useEffect(() => {
        console.log(555)
    }, [])

    return (
        <div>
            {height}
        </div>
    );
};

export default ChartWidget;
