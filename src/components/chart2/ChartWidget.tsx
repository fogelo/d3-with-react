import React, {useEffect, useRef, useState} from "react";
import useWindowDimensions from "./hooks/useWindowDimensions";
import * as d3 from "d3";
import Brush from "./Brash";

const ChartWidget = () => {
    const [data, setData] = useState<any>()

    const [propertiesNames] = useState(["date", "value"])

    const {height, width} = useWindowDimensions()

    const dimensions = useRef<any>(null)
    dimensions.current = getDimensions(width * 0.9, height * 0.5, 50, 50, 10, 50)


    useEffect(() => {
        dimensions.current = getDimensions(width * 0.9, height * 0.5, 50, 50, 10, 50)
        console.log(dimensions)
    }, [height, width, dimensions])


    const loadData = () => {
        d3.dsv(",", "/data/area.csv", (d) => {
            return d
        }).then((d) => {
            setData(d)
        })
    }

    useEffect(() => {
        if (data?.length <= 1)
            loadData()
    })
    const onBrushUpdateData = (values: any) => {
        // console.log(`${values[0].toDateString()  }, ${  values[1].toDateString()}`)
        let newData
        // eslint-disable-next-line prefer-const
        newData = []
        for (let i = 0; i < data.length; i++) {
            // const check = data[i].date as unknown as Date
            const check = d3.timeParse('%Y-%m-%d')(data[i].date as unknown as string)
            // @ts-ignore
            if (check >= values[0] && check <= values[1]) {
                newData.push(data[i])
            }
        }
        // eslint-disable-next-line no-console
        if (newData.length > 1) {
            // console.log(`newData: ${  newData.length}`)
            setData(newData)
        }
    }


    return (
        <div>
            <Brush
                // @ts-ignore
                dimensions={dimensions.current}
                data={data}
                onBrushUpdateData={onBrushUpdateData}
                propertiesNames={propertiesNames}
                fill="tomato"
                stroke="rgb(47, 74, 89)"
                focusHeight={100}
            />
        </div>
    );
};

export default ChartWidget;

const getDimensions = (width: number, height: number, left: number, right: number, top: number, bottom: number) => {
    const dimensions = {
        width,
        height,
        margin: {
            left,
            right,
            top,
            bottom,
        },
        boundedWidth: 0,
        boundedHeight: 0,
    }
    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

    return dimensions
}
