export var Result;
(function (Result) {
    Result["success"] = "success";
    Result["failure"] = "failure";
    Result["running"] = "running";
    Result["queued"] = "queued";
    Result["paused"] = "paused";
    Result["unstable"] = "unstable";
    Result["aborted"] = "aborted";
    Result["not_built"] = "not_built";
    Result["skipped"] = "skipped";
    Result["unknown"] = "unknown";
})(Result || (Result = {}));

export function decodeResultValue(resultMaybe) {
    const lcase = String(resultMaybe).toLowerCase();
    for (const enumKey of Object.keys(Result)) {
        const enumValue = Result[enumKey];
        if (enumKey.toLowerCase() === lcase || enumValue.toLowerCase() === lcase) {
            return enumValue;
        }
    }
    return Result.unknown;
}

// Dimensions used for layout, px
export const defaultLayout = {
    nodeSpacingH: 120,
    parallelSpacingH: 120,
    nodeSpacingV: 70,
    nodeRadius: 12,
    terminalRadius: 7,
    curveRadius: 12,
    connectorStrokeWidth: 3.5,
    labelOffsetV: 20,
    smallLabelOffsetV: 15,
    ypStart: 55,
};
