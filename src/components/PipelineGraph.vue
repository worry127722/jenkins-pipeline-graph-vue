<script>
    import {nodeStrokeWidth, getGroupForResult} from './support/StatusIcons.js';
    import TruncatingLabel from './support/TruncatingLabel';
    import {decodeResultValue, defaultLayout,} from './PipelineGraphModel.js';
    import {layoutGraph, sequentialStagesLabelOffset} from './PipelineGraphLayout.js';

    export default {
        name: "pipeline-graph",
        components: {},
        data() {
            return {
                nodeColumns: [],
                connections: [],
                bigLabels: [],
                smallLabels: [],
                branchLabels: [],
                measuredWidth: 0,
                measuredHeight: 0,
                layout2: Object.assign({}, defaultLayout, this.layout),
                selectedStage2: this.selectedStage,
                stages2: this.stages,
            }
        },
        props: ['layout', 'selectedStage', 'stages', 'onNodeClick'],
        beforeMount() {
            this.stagesUpdated(this.stages);
        },
        beforeUpdate() {
            let newState;
            let needsLayout = false;
            if (this.layout != this.layout2) {
                newState = Object.assign({}, newState, {layout2: Object.assign({}, defaultLayout, this.layout2)});
                needsLayout = true;
            }
            if (this.selectedStage !== this.selectedStage2) {
                // If we're just changing selectedStage, we don't need to re-generate the children
                newState = Object.assign({}, newState, {selectedStage2: this.selectedStage});
            }
            if (this.stages !== this.stages2) {
                needsLayout = true;
            }
            const doLayoutIfNeeded = () => {
                if (needsLayout) {
                    this.stagesUpdated(this.stages);
                }
            };
            if (newState) {
                // If we need to update the state, then we'll delay any layout changes
                this.setState(newState, doLayoutIfNeeded);
            } else {
                doLayoutIfNeeded();
            }
        },
        beforeDestroy() {
        },
        mounted() {
        },
        updated() {
        },
        render: function (createElement) {
            const nodeColumns = this.nodeColumns;
            const connections = this.connections;
            const bigLabels = this.bigLabels;
            const smallLabels = this.smallLabels;
            const branchLabels = this.branchLabels;
            const measuredWidth = this.measuredWidth;
            const measuredHeight = this.measuredHeight;

            // Without these we get fire, so they're hardcoded
            const outerDivStyle = {
                position: 'relative',
                overflow: 'visible',
            };
            const svgElements = []; // Buffer for children of the SVG
            connections.forEach(connection => {
                this.renderCompositeConnection(connection, svgElements, createElement);
            });
            this.renderSelectionHighlight(svgElements, createElement);
            for (const column of nodeColumns) {
                for (const row of column.rows) {
                    for (const node of row) {
                        this.renderNode(node, svgElements, createElement);
                    }
                }
            }
            return createElement("div", {class: "PWGx-PipelineGraph-container"},
                [createElement("div", {style: outerDivStyle, class: "PWGx-PipelineGraph"},
                    [createElement("svg", {attrs: {width: measuredWidth, height: measuredHeight}}, svgElements),
                        bigLabels.map(label => this.renderBigLabel(label, createElement)),
                        smallLabels.map(label => this.renderSmallLabel(label, createElement)),
                        branchLabels.map(label => this.renderSequentialContainerLabel(label, createElement))
                    ])
                ]);
        },
        methods: {
            connectorKey(leftNode, rightNode) {
                return 'c_' + leftNode.key + '_to_' + rightNode.key;
            },
            /**
             * Main process for laying out the graph. Calls out to PipelineGraphLayout module.
             */
            stagesUpdated(newStages = []) {
//111111
                // this.setState(layoutGraph(newStages, this.layout2));

                let ttp = layoutGraph(newStages, this.layout2);
                this.nodeColumns = ttp.nodeColumns;
                this.connections = ttp.connections;
                this.bigLabels = ttp.bigLabels;
                this.smallLabels = ttp.smallLabels;
                this.branchLabels = ttp.branchLabels;
                this.measuredWidth = ttp.measuredWidth;
                this.measuredHeight = ttp.measuredHeight;
            },
            /**
             * Generate the Component for a big label
             */
            renderBigLabel(details, createElement) {
                const {nodeSpacingH, labelOffsetV, connectorStrokeWidth, ypStart} = this.layout2;
                const labelWidth = nodeSpacingH - connectorStrokeWidth * 2;
                const labelHeight = ypStart - labelOffsetV;
                const labelOffsetH = Math.floor(labelWidth / -2);
                // These are about layout more than appearance, so they should probably remain inline
                const bigLabelStyle = {
                    position: 'absolute',
                    width: labelWidth + 'px',
                    maxHeight: labelHeight + 'px',
                    textAlign: 'center',
                    marginLeft: labelOffsetH + 'px',
                };
                const x = details.x;
                const bottom = this.measuredHeight - details.y + labelOffsetV;
                // These are about layout more than appearance, so they're inline
                const style = Object.assign({}, bigLabelStyle, {bottom: bottom + 'px', left: x + 'px'});
                const classNames = ['PWGx-pipeline-big-label'];
                if (this.stageIsSelected(details.stage) || this.stageChildIsSelected(details.stage)) {
                    classNames.push('selected');
                }
                return createElement(TruncatingLabel, {
                    props: {className: classNames.join(' '), style2: style, children: details.text},
                    key: details.key,
                }, [details.text]);
            },
            /**
             * Generate the Component for a small label
             */
            renderSmallLabel(details, createElement) {
                const {nodeSpacingH, nodeSpacingV, curveRadius, connectorStrokeWidth, nodeRadius, smallLabelOffsetV} = this.layout2;
                const smallLabelWidth = Math.floor(nodeSpacingH - 2 * curveRadius - 2 * connectorStrokeWidth); // Fit between lines
                const smallLabelHeight = Math.floor(nodeSpacingV - smallLabelOffsetV - nodeRadius - nodeStrokeWidth);
                const smallLabelOffsetH = Math.floor(smallLabelWidth * -0.5);
                const x = details.x + smallLabelOffsetH;
                const top = details.y + smallLabelOffsetV;
                // These are about layout more than appearance, so they're inline
                const stylex = {
                    top: top + 'px',
                    left: x + 'px',
                    position: 'absolute',
                    width: smallLabelWidth + 'px',
                    maxHeight: smallLabelHeight + 'px',
                    textAlign: 'center',
                };
                const style = Object.assign({}, stylex);
                const classNames = ['PWGx-pipeline-small-label'];
                if (details.stage && this.stageIsSelected(details.stage)) {
                    classNames.push('selected');
                }
                return createElement(TruncatingLabel, {
                    props: {className: classNames.join(' '), style2: style, children: details.text},
                    key: details.key,
                }, [details.text]);
            },
            /**
             * Generate the Component for a small label denoting the name of the container of a group of sequential parallel stages
             */
            renderSequentialContainerLabel(details, createElement) {
                const {nodeRadius} = this.layout2;
                const seqContainerName = details.text;
                const y = details.y;
                const x = details.x - Math.floor(nodeRadius * 2); // Because label X is a "node center"-relative position
                const containerStyle = {
                    top: y,
                    left: x,
                    marginTop: '-0.5em',
                    position: 'absolute',
                    maxWidth: sequentialStagesLabelOffset,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    background: 'white',
                    padding: '0 7px',
                    lineHeight: '1',
                    whiteSpace: 'nowrap',
                };
                return createElement("div", {
                    style: containerStyle,
                    key: details.key,
                    attrs: {title: seqContainerName}
                }, seqContainerName);
            },
            /**
             * Generate SVG for a composite connection, which may be to/from many nodes.
             *
             * Farms work out to other methods on self depending on the complexity of the line required. Adds all the SVG
             * components to the elements list.
             */
            renderCompositeConnection(connection, svgElements, createElement) {
                const {sourceNodes, destinationNodes, skippedNodes, hasBranchLabels} = connection;
                if (skippedNodes.length === 0) {
                    // Nothing too complicated, use the original connection drawing code
                    this.renderBasicConnections(sourceNodes, destinationNodes, svgElements, hasBranchLabels, createElement);
                } else {
                    this.renderSkippingConnections(sourceNodes, destinationNodes, skippedNodes, svgElements, hasBranchLabels, createElement);
                }
            },
            /**
             * Connections between adjacent columns without any skipping.
             *
             * Adds all the SVG components to the elements list.
             */
            renderBasicConnections(sourceNodes, destinationNodes, svgElements, hasBranchLabels, createElement) {
                const {connectorStrokeWidth, nodeSpacingH} = this.layout2;
                const halfSpacingH = nodeSpacingH / 2;
                // Stroke props common to straight / curved connections
                const connectorStroke = {
                    class: 'PWGx-pipeline-connector',
                    attrs: {strokeWidth: connectorStrokeWidth},
                };
                this.renderHorizontalConnection(sourceNodes[0], destinationNodes[0], connectorStroke, svgElements, createElement);
                if (sourceNodes.length === 1 && destinationNodes.length === 1) {
                    return; // No curves needed.
                }
                // Work out the extents of source and dest space
                let rightmostSource = sourceNodes[0].x;
                let leftmostDestination = destinationNodes[0].x;
                for (let i = 1; i < sourceNodes.length; i++) {
                    rightmostSource = Math.max(rightmostSource, sourceNodes[i].x);
                }
                for (let i = 1; i < destinationNodes.length; i++) {
                    leftmostDestination = Math.min(leftmostDestination, destinationNodes[i].x);
                }
                // Collapse from previous node(s) to top column node
                const collapseMidPointX = Math.round(rightmostSource + halfSpacingH);
                for (const previousNode of sourceNodes.slice(1)) {
                    this.renderBasicCurvedConnection(previousNode, destinationNodes[0], collapseMidPointX, svgElements, createElement);
                }
                // Expand from top previous node to column node(s)
                let expandMidPointX = Math.round(leftmostDestination - halfSpacingH);
                if (hasBranchLabels) {
                    // Shift curve midpoint so that there's room for the labels
                    expandMidPointX -= sequentialStagesLabelOffset;
                }
                for (const destNode of destinationNodes.slice(1)) {
                    this.renderBasicCurvedConnection(sourceNodes[0], destNode, expandMidPointX, svgElements, createElement);
                }
            },
            /**
             * Renders a more complex connection, that "skips" one or more nodes
             *
             * Adds all the SVG components to the elements list.
             */
            renderSkippingConnections(sourceNodes, destinationNodes, skippedNodes, svgElements, hasBranchLabels, createElement) {
                const {connectorStrokeWidth, nodeRadius, terminalRadius, curveRadius, nodeSpacingV, nodeSpacingH} = this.layout2;
                const halfSpacingH = nodeSpacingH / 2;
                // Stroke props common to straight / curved connections
                const connectorStroke = {
                    class: 'PWGx-pipeline-connector',
                    attrs: {strokeWidth: connectorStrokeWidth},
                };
                const skipConnectorStroke = {
                    class: 'PWGx-pipeline-connector-skipped',
                    attrs: {strokeWidth: connectorStrokeWidth},
                };
                const lastSkippedNode = skippedNodes[skippedNodes.length - 1];
                let leftNode, rightNode;
                //--------------------------------------------------------------------------
                //  Draw the "ghost" connections to/from/between skipped nodes
                leftNode = sourceNodes[0];
                for (rightNode of skippedNodes) {
                    this.renderHorizontalConnection(leftNode, rightNode, skipConnectorStroke, svgElements, createElement);
                    leftNode = rightNode;
                }
                this.renderHorizontalConnection(leftNode, destinationNodes[0], skipConnectorStroke, svgElements, createElement);
                //--------------------------------------------------------------------------
                //  Work out the extents of source and dest space
                let rightmostSource = sourceNodes[0].x;
                let leftmostDestination = destinationNodes[0].x;
                for (let i = 1; i < sourceNodes.length; i++) {
                    rightmostSource = Math.max(rightmostSource, sourceNodes[i].x);
                }
                for (let i = 1; i < destinationNodes.length; i++) {
                    leftmostDestination = Math.min(leftmostDestination, destinationNodes[i].x);
                }
                //--------------------------------------------------------------------------
                //  "Collapse" from the source node(s) down toward the first skipped
                leftNode = sourceNodes[0];
                rightNode = skippedNodes[0];
                for (leftNode of sourceNodes.slice(1)) {
                    const midPointX = Math.round(rightmostSource + halfSpacingH);
                    const leftNodeRadius = leftNode.isPlaceholder ? terminalRadius : nodeRadius;
                    const key = this.connectorKey(leftNode, rightNode);
                    const x1 = leftNode.x + leftNodeRadius - nodeStrokeWidth / 2;
                    const y1 = leftNode.y;
                    const x2 = midPointX;
                    const y2 = rightNode.y;
                    const pathData = `M ${x1} ${y1}` + this.svgBranchCurve(x1, y1, x2, y2, midPointX, curveRadius);
                    svgElements.push(createElement("path", Object.assign({}, connectorStroke, {
                        key: key,
                        attrs: {d: pathData, fill: "none", strokeWidth: connectorStroke.attrs.strokeWidth}
                    })));
                }
                //--------------------------------------------------------------------------
                //  "Expand" from the last skipped node toward the destination nodes
                leftNode = lastSkippedNode;
                let expandMidPointX = Math.round(leftmostDestination - halfSpacingH);
                if (hasBranchLabels) {
                    // Shift curve midpoint so that there's room for the labels
                    expandMidPointX -= sequentialStagesLabelOffset;
                }
                for (rightNode of destinationNodes.slice(1)) {
                    const rightNodeRadius = rightNode.isPlaceholder ? terminalRadius : nodeRadius;
                    const key = this.connectorKey(leftNode, rightNode);
                    const x1 = expandMidPointX;
                    const y1 = leftNode.y;
                    const x2 = rightNode.x - rightNodeRadius + nodeStrokeWidth / 2;
                    const y2 = rightNode.y;
                    const pathData = `M ${x1} ${y1}` + this.svgBranchCurve(x1, y1, x2, y2, expandMidPointX, curveRadius);
                    svgElements.push(createElement("path", Object.assign({}, connectorStroke, {
                        key: key,
                        attrs: {d: pathData, fill: "none", strokeWidth: connectorStroke.attrs.strokeWidth}
                    })));
                }
                //--------------------------------------------------------------------------
                //  "Main" curve from top of source nodes, around skipped nodes, to top of dest nodes
                leftNode = sourceNodes[0];
                rightNode = destinationNodes[0];
                const leftNodeRadius = leftNode.isPlaceholder ? terminalRadius : nodeRadius;
                const rightNodeRadius = rightNode.isPlaceholder ? terminalRadius : nodeRadius;
                const key = this.connectorKey(leftNode, rightNode);
                const skipHeight = nodeSpacingV * 0.5;
                const controlOffsetUpper = curveRadius * 1.54;
                const controlOffsetLower = skipHeight * 0.257;
                const controlOffsetMid = skipHeight * 0.2;
                const inflectiontOffset = Math.round(skipHeight * 0.7071); // cos(45º)-ish
                // Start point
                const p1x = leftNode.x + leftNodeRadius - nodeStrokeWidth / 2;
                const p1y = leftNode.y;
                // Begin curve down point
                const p2x = Math.round(skippedNodes[0].x - halfSpacingH);
                const p2y = p1y;
                const c1x = p2x + controlOffsetUpper;
                const c1y = p2y;
                // End curve down point
                const p4x = skippedNodes[0].x;
                const p4y = p1y + skipHeight;
                const c4x = p4x - controlOffsetLower;
                const c4y = p4y;
                // Curve down midpoint / inflection
                const p3x = skippedNodes[0].x - inflectiontOffset;
                const p3y = skippedNodes[0].y + inflectiontOffset;
                const c2x = p3x - controlOffsetMid;
                const c2y = p3y - controlOffsetMid;
                const c3x = p3x + controlOffsetMid;
                const c3y = p3y + controlOffsetMid;
                // Begin curve up point
                const p5x = lastSkippedNode.x;
                const p5y = p4y;
                const c5x = p5x + controlOffsetLower;
                const c5y = p5y;
                // End curve up point
                const p7x = Math.round(lastSkippedNode.x + halfSpacingH);
                const p7y = rightNode.y;
                const c8x = p7x - controlOffsetUpper;
                const c8y = p7y;
                // Curve up midpoint / inflection
                const p6x = lastSkippedNode.x + inflectiontOffset;
                const p6y = lastSkippedNode.y + inflectiontOffset;
                const c6x = p6x - controlOffsetMid;
                const c6y = p6y + controlOffsetMid;
                const c7x = p6x + controlOffsetMid;
                const c7y = p6y - controlOffsetMid;
                // End point
                const p8x = rightNode.x - rightNodeRadius + nodeStrokeWidth / 2;
                const p8y = rightNode.y;
                const pathData = `M ${p1x} ${p1y}` +
                    `L ${p2x} ${p2y}` + // 1st horizontal
                    `C ${c1x} ${c1y} ${c2x} ${c2y} ${p3x} ${p3y}` + // Curve down (upper)
                    `C ${c3x} ${c3y} ${c4x} ${c4y} ${p4x} ${p4y}` + // Curve down (lower)
                    `L ${p5x} ${p5y}` + // 2nd horizontal
                    `C ${c5x} ${c5y} ${c6x} ${c6y} ${p6x} ${p6y}` + // Curve up (lower)
                    `C ${c7x} ${c7y} ${c8x} ${c8y} ${p7x} ${p7y}` + // Curve up (upper)
                    `L ${p8x} ${p8y}` + // Last horizontal
                    '';
                svgElements.push(createElement("path", Object.assign({}, connectorStroke, {
                    key: key,
                    attrs: {d: pathData, fill: "none", strokeWidth: connectorStroke.attrs.strokeWidth}
                })));
            },
            /**
             * Simple straight connection.
             *
             * Adds all the SVG components to the elements list.
             */
            renderHorizontalConnection(leftNode, rightNode, connectorStroke, svgElements, createElement) {
                const {nodeRadius, terminalRadius} = this.layout2;
                const leftNodeRadius = leftNode.isPlaceholder ? terminalRadius : nodeRadius;
                const rightNodeRadius = rightNode.isPlaceholder ? terminalRadius : nodeRadius;
                const key = this.connectorKey(leftNode, rightNode);
                const x1 = leftNode.x + leftNodeRadius - nodeStrokeWidth / 2;
                const x2 = rightNode.x - rightNodeRadius + nodeStrokeWidth / 2;
                const y = leftNode.y;
                svgElements.push(createElement("line", Object.assign({}, connectorStroke, {
                    key: key,
                    attrs: {x1: x1, y1: y, x2: x2, y2: y, strokeWidth: connectorStroke.attrs.strokeWidth}
                })));
            },
            /**
             * A direct curve between two nodes in adjacent columns.
             *
             * Adds all the SVG components to the elements list.
             */
            renderBasicCurvedConnection(leftNode, rightNode, midPointX, svgElements, createElement) {
                const {nodeRadius, terminalRadius, curveRadius, connectorStrokeWidth} = this.layout2;
                const leftNodeRadius = leftNode.isPlaceholder ? terminalRadius : nodeRadius;
                const rightNodeRadius = rightNode.isPlaceholder ? terminalRadius : nodeRadius;
                const key = this.connectorKey(leftNode, rightNode);
                const leftPos = {
                    x: leftNode.x + leftNodeRadius - nodeStrokeWidth / 2,
                    y: leftNode.y,
                };
                const rightPos = {
                    x: rightNode.x - rightNodeRadius + nodeStrokeWidth / 2,
                    y: rightNode.y,
                };
                // Stroke props common to straight / curved connections
                const connectorStroke = {
                    class: 'PWGx-pipeline-connector',
                    attrs: {strokeWidth: connectorStrokeWidth},
                };
                const pathData = `M ${leftPos.x} ${leftPos.y}` + this.svgBranchCurve(leftPos.x, leftPos.y, rightPos.x, rightPos.y, midPointX, curveRadius);
                svgElements.push(createElement("path", Object.assign({}, connectorStroke, {
                    key: key,
                    attrs: {d: pathData, fill: "none", strokeWidth: connectorStroke.attrs.strokeWidth}
                })));
            },
            /**
             * Generates an SVG path string for the "vertical" S curve used to connect nodes in adjacent columns.
             */
            svgBranchCurve(x1, y1, x2, y2, midPointX, curveRadius) {
                const verticalDirection = Math.sign(y2 - y1); // 1 == curve down, -1 == curve up
                const w1 = midPointX - curveRadius - x1 + curveRadius * verticalDirection;
                const w2 = x2 - curveRadius - midPointX - curveRadius * verticalDirection;
                const v = y2 - y1 - 2 * curveRadius * verticalDirection; // Will be -ive if curve up
                const cv = verticalDirection * curveRadius;
                return (` l ${w1} 0` + // first horizontal line
                    ` c ${curveRadius} 0 ${curveRadius} ${cv} ${curveRadius} ${cv}` + // turn
                    ` l 0 ${v}` + // vertical line
                    ` c 0 ${cv} ${curveRadius} ${cv} ${curveRadius} ${cv}` + // turn again
                    ` l ${w2} 0` // second horizontal line
                );
            },
            /**
             * Generate the SVG elements to represent a node.
             *
             * Adds all the SVG components to the elements list.
             */
            renderNode(node, svgElements, createElement) {
                let nodeIsSelected = false;
                const {nodeRadius, connectorStrokeWidth, terminalRadius} = this.layout2;
                const key = node.key;
                const groupChildren = [];
                if (node.isPlaceholder === true) {
                    groupChildren.push(createElement("circle", {
                        attrs: {r: terminalRadius},
                        class: "PWGx-pipeline-node-terminal"
                    }));
                } else {
                    const {completePercent = 0, title, state} = node.stage;
                    const resultClean = decodeResultValue(state);
                    groupChildren.push(getGroupForResult(resultClean, completePercent, nodeRadius, createElement));
                    if (title) {
                        groupChildren.push(createElement("title", null, title));
                    }
                    nodeIsSelected = this.stageIsSelected(node.stage);
                }
                // Set click listener and link cursor only for nodes we want to be clickable
                const clickableProps = {};
                if (node.isPlaceholder === false && node.stage.state !== 'skipped') {
                    clickableProps.cursor = 'pointer';
                    clickableProps.onClick = () => this.nodeClicked(node);
                }
                // Add an invisible click/touch/mouseover target, coz the nodes are small and (more importantly)
                // many are hollow.
                groupChildren.push(createElement("circle", Object.assign({
                    attrs: {
                        r: nodeRadius + 2 * connectorStrokeWidth,
                        'fill-opacity': "0",
                        stroke: "none", ...clickableProps
                    }, class: "PWGx-pipeline-node-hittarget"
                })));
                // Most of the nodes are in shared code, so they're rendered at 0,0. We transform with a <g> to position them
                const groupProps = {
                    key,
                    attrs: {transform: `translate(${node.x},${node.y})`},
                    class: nodeIsSelected ? 'PWGx-pipeline-node-selected' : 'PWGx-pipeline-node',
                };
                svgElements.push(createElement('g', groupProps, [...groupChildren]));
            },
            /**
             * Generates SVG for visual highlight to show which node is selected.
             *
             * Adds all the SVG components to the elements list.
             */
            renderSelectionHighlight(svgElements, createElement) {
                const {nodeRadius, connectorStrokeWidth} = this.layout2;
                const highlightRadius = Math.ceil(nodeRadius + 0.5 * connectorStrokeWidth + 1);
                let selectedNode;
                columnLoop: for (const column of this.nodeColumns) {
                    for (const row of column.rows) {
                        for (const node of row) {
                            if (node.isPlaceholder === false && this.stageIsSelected(node.stage)) {
                                selectedNode = node;
                                break columnLoop;
                            }
                        }
                    }
                }
                if (selectedNode) {
                    const transform = `translate(${selectedNode.x} ${selectedNode.y})`;
                    svgElements.push(createElement("g", {
                            class: "PWGx-pipeline-selection-highlight",
                            attrs: {transform: transform},
                            key: "selection-highlight"
                        },
                        [createElement("circle", {attrs: {r: highlightRadius, strokeWidth: connectorStrokeWidth}})]));
                }
            },
            /**
             * Is this stage currently selected?
             */
            stageIsSelected(stage) {
                const selectedStage = this.selectedStage2;
                return (selectedStage && stage && selectedStage.id === stage.id) || false;
            },
            /**
             * Is this any child of this stage currently selected?
             */
            stageChildIsSelected(stage) {
                if (stage) {
                    const {children} = stage;
                    const selectedStage = this.selectedStage2;
                    if (children && selectedStage) {
                        for (const childStage of children) {
                            let currentStage = childStage;
                            while (currentStage) {
                                if (currentStage.id === selectedStage.id) {
                                    return true;
                                }
                                currentStage = currentStage.nextSibling;
                            }
                        }
                    }
                }
                return false;
            },
            nodeClicked(node) {
                if (node.isPlaceholder === false && node.stage.state !== 'skipped') {
                    const stage = node.stage;
                    const listener = this.onNodeClick;
                    if (listener) {
                        listener(stage.name, stage.id);
                    }
                    // Update selection
                    // this.setState({ selectedStage: stage });
                    this.selectedStage2 = stage;
                }
            }

        },
    };
</script>
<style>

</style>
