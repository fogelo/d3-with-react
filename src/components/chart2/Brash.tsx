import React, {useCallback, useRef, useState} from "react";
import {BrushBehavior} from "d3-brush";
import BrushChartHelper from "../chart1/BrushHelper";
import * as d3 from "d3";
import {Types} from "../chart1/types";

const Brash = (props : any) => {
    const [loaded, setLoaded] = useState(false)

    const [prevHeight, setPrevHeight] = useState(props.dimensions.height)
    const [prevWidth, setPrevWidth] = useState(props.dimensions.width)

    const brush = useRef() as { current: BrushBehavior<unknown> }


    const memoizedDrawCallback = useCallback(() => {
        const scales = BrushChartHelper.getScales(props.data, props.dimensions.boundedWidth, props.focusHeight, props.propertiesNames)

        // draw chart
        const linesGenerator = d3
            .area()
            // @ts-ignore
            .x((d) => scales.xScale(helper.xAccessor(d)))
            // @ts-ignore
            .y0(scales.yScale(0))
            .y1((d) => {
                // @ts-ignore
                return scales.yScale((d as Types.Data).value)
            })

        d3.select('#brush-path')
            .attr('fill', props.fill)
            .attr('stroke', props.stroke)
            // @ts-ignore
            .attr('d', linesGenerator(props.data))

        brush.current = d3
            .brushX()
            .extent([
                [0, 0.5],
                [props.dimensions.width - props.dimensions.margin.right - props.dimensions.margin.left, props.focusHeight],
            ])
            .on('brush', brushed)
            .on('end', brushEnded)
        const defaultSelection = [0, 0]

        d3
            .select('#group-brush')
            // @ts-ignore
            .call(brush.current)
            // @ts-ignore
            .call(brush.current.move, defaultSelection)

        // brush handlers
        function brushed(event: { selection: number[] }) {
            // TODO
        }
        function brushEnded(event: { selection: number[] }) {
            const value = [scales.xScale.invert(event.selection[0]), scales.xScale.invert(event.selection[1])]
            props.onBrushUpdateData(value)
        }

    },[props])



    return (
        <div>

        </div>
    );
};

export default Brash;
