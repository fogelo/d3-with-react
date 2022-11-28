import React, {useEffect, useCallback, useState, useRef} from "react"
import * as d3 from "d3"
import {BrushBehavior} from "d3-brush"
import BrushChartHelper from "./BrushHelper"
import {Types} from "./types";

const xAccessor = (d: any) => d["date"]

const yAccessor = (d: any) => d["value"]

const Brush = (props: IBrushProps) => {
    console.log(props)
    const [loaded, setLoaded] = useState(false)

    const [prevHeight, setPrevHeight] = useState(props.dimensions.height)
    const [prevWidth, setPrevWidth] = useState(props.dimensions.width)

    const brush = useRef() as { current: BrushBehavior<unknown> }

    const memoizedDrawCallback = useCallback(() => {

        const xScale = d3
            .scaleTime()
            // @ts-ignore

            .domain(d3.extent(props.data, d => new Date(d.date).getTime()))
            .range([0, props.dimensions.boundedWidth])

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(props.data, (d) => {
                return +(d.value as number)
            }),] as number[])
            .range([props.focusHeight, 0])

        const scales = BrushChartHelper.getScales(props.data, props.dimensions.boundedWidth, props.focusHeight, props.propertiesNames)
        const helper = new BrushChartHelper(props.propertiesNames)

        // draw chart
        const linesGenerator = d3
            .line()
            // @ts-ignore
            .x((d) => xScale(new Date(d.date).getTime()))
            // @ts-ignore
            .y((d) => yScale(d.value))


        // const line1 = d3.line().x(d => xScale(d.date)).y(d => yScale1(d.value))

        d3.select("#brush-path")
            .attr("fill", "none")
            .attr("stroke", "white")
            // @ts-ignore
            .attr("d", linesGenerator(props.data))

        brush.current = d3
            .brushX()
            .extent([
                [0, 0.5],
                [props.dimensions.width - props.dimensions.margin.right - props.dimensions.margin.left, props.focusHeight],
            ])
            .on("brush", brushed)
            .on("end", brushEnded)

        const defaultSelection = [0, 0]

        d3
            .select("#group-brush")
            // @ts-ignore
            .call(brush.current)
            // @ts-ignore
            .call(brush.current.move, defaultSelection)

        // brush handlers
        function brushed(event: { selection: number[] }) {
            // TODO
        }

        function brushEnded(event: { selection: number[] }) {
            const value = [xScale.invert(event.selection[0]), xScale.invert(event.selection[1])]
            props.onBrushUpdateData(value)
        }

        // Peripherals

        // eslint-disable-next-line max-len
        const xAxis = (
            g: { attr: (arg0: string, arg1: string) => { (): never; new(): never; call: { (arg0: d3.Axis<d3.AxisDomain>): never; new(): never } } },
            x: d3.AxisScale<d3.AxisDomain>,
            xAxisHeight: number
        ) =>
            g.attr("transform", `translate(0,${xAxisHeight})`).call(
                d3
                    .axisBottom(x)
                    .ticks(props.dimensions.width / 80)
                    .tickSizeOuter(0)
            )

        d3
            .select("#x-axis-brush")
            // @ts-ignore
            .call(xAxis, xScale, props.focusHeight)

        // yAxis
        const yAxisGenerator = d3.axisLeft(yScale)
        d3
            .select("#y-axis-brush")
            // @ts-ignore
            .call(yAxisGenerator)

    }, [props])

    const memoizedUpdateCallback = useCallback(() => {
        d3.selectAll("#x-axis-brush").selectAll("*").remove()
        d3.selectAll("#y-axis-brush").selectAll("*").remove()
        d3.selectAll("#brush-path").selectAll("*").remove()
    }, [])

    useEffect(() => {
        if (!loaded) {
            setLoaded(true)
            memoizedDrawCallback()
        }
    }, [loaded, memoizedDrawCallback])

    useEffect(() => {
        memoizedDrawCallback()
    }, [memoizedDrawCallback, props.data])

    useEffect(() => {
        const isNewHeight = prevHeight !== props.dimensions.height
        const isNewWidth = prevWidth !== props.dimensions.width
        if (isNewHeight || isNewWidth) {
            setPrevWidth(props.dimensions.height)
            setPrevHeight(props.dimensions.width)
            memoizedUpdateCallback()
            memoizedDrawCallback()
        }
    }, [memoizedDrawCallback, memoizedUpdateCallback, prevHeight, prevWidth, props.dimensions.height, props.dimensions.width])

    return (
        <div id="div">
            <svg
                id="brush-wrapper"
                width={props.dimensions.width}
                height={props.dimensions.height}
                style={{display: "block"}}
            >
                <g
                    id="brush-bounds"
                    style={{transform: `translate(${props.dimensions.margin.left}px, ${props.dimensions.margin.top}px)`}}
                >
                    <path id="brush-path"/>
                    <g id="x-axis-brush"/>
                    <g id="y-axis-brush"/>
                    <g id="group-brush"/>
                </g>
            </svg>
        </div>
    )
}

interface IBrushProps {
    dimensions: Types.Dimensions
    data: Types.Data[]
    propertiesNames: string[]
    onBrushUpdateData: (value: Date[]) => void
    fill: string
    stroke: string
    focusHeight: number
}

export default Brush
