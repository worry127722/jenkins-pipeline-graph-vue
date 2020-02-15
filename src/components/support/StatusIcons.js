import {Result} from '../PipelineGraphModel';
import {SvgSpinner} from './SvgSpinner';
import SvgStatus from './SvgStatus';

export const nodeStrokeWidth = 3.5; // px.
// Returns the correct <g> element for the result / progress percent.
export function getGroupForResult(result, percentage, radius, createElement) {
    switch (result) {
        case Result.running:
        case Result.queued:
            return createElement(SvgSpinner, {props: {radius: radius, result: result, percentage: percentage}});
        case Result.not_built:
        case Result.skipped:
        case Result.success:
        case Result.failure:
        case Result.paused:
        case Result.unstable:
        case Result.aborted:
        case Result.unknown:
            return createElement(SvgStatus, {props: {radius: radius, result: result}});
        default:
            badResult(result);
            return createElement(SvgStatus, {props: {radius: radius, result: Result.unknown}});
    }
}

function badResult(x) {
    console.error('Unexpected Result value', x);
}
