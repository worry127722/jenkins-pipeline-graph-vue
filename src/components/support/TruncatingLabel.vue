<script>
    //--------------------------------------
    //  Safety constants
    //--------------------------------------
    const MINLENGTH = 5; // Minimum size of cut-down text
    const MAXLOOPS = 50; // Max no of iterations attempting to find the correct size text
    //--------------------------------------
    //  Render lifecycle
    //--------------------------------------
    var RenderState;
    (function (RenderState) {
        RenderState[RenderState["INITIAL"] = 0] = "INITIAL";
        RenderState[RenderState["MEASURE"] = 1] = "MEASURE";
        RenderState[RenderState["FLUID"] = 2] = "FLUID";
        RenderState[RenderState["STABLE"] = 3] = "STABLE";
    })(RenderState || (RenderState = {}));
    /**
     * Multi-line label that will truncate with ellipses
     *
     * Use with a set width + height (or maxWidth / maxHeight) to get any use from it :D
     */

    export default {
        name: "truncating-label",
        components: {},
        data() {
            return {
                completeText: '', // Unabridged plain text content
                innerText: '', // Current innerText of element - includes possible ellipses
                renderState: RenderState.INITIAL, // Internal rendering lifecycle state
                //--------------------------------------
                //  Binary search state
                //--------------------------------------
                textCutoffLength: 0, // Last count used to truncate completeText
                longestGood: 0, // Length of the longest truncated text that fits
                shortestBad: 0, // Length of the shortest truncated text that does not fit
                loopCount: 0, // to avoid infinite iteration
            }
        },
        props: ['children', 'className', 'style2'],
        beforeMount() {
            this.handleProps(this.children);
        },
        beforeUpdate() {
            this.invalidateSize();
        },
        beforeDestroy() {
            if (this.checkSizeRequest) {
                cancelAnimationFrame(this.checkSizeRequest);
                this.checkSizeRequest = 0;
            }
        },
        mounted() {
            this.invalidateSize();
        },
        updated() {
        },
        render: function (createElement) {
            const className = this.className || '';
            const style = this.style2 || {};
            const mergedStyle = Object.assign({overflow: 'hidden', wordWrap: 'break-word'}, style);

            if (this.renderState !== RenderState.STABLE) {
                mergedStyle.opacity = 0;
            }
            return createElement("div", {
                class: 'TruncatingLabel ' + className,
                ref: 'targetWW',
                style: mergedStyle,
                attrs: {title: this.innerText}
            }, this.innerText);
        },
        methods: {
            handleProps(childrenT) {
                const children = childrenT || '';
                if (typeof children === 'string') {
                    this.completeText = children;
                } else if (children === null || children === false) {
                    this.completeText = '';
                } else {
                    console.warn('TruncatingLabel - Label children must be string but is', typeof children, children);
                    this.completeText = 'Contents must be string';
                }
                this.renderState = RenderState.MEASURE;
                this.innerText = this.completeText;
                this.loopCount = 0;
                this.longestGood = MINLENGTH;
                this.shortestBad = this.innerText.length;
            },
            invalidateSize() {
                if (!this.checkSizeRequest) {
                    this.checkSizeRequest = requestAnimationFrame(() => this.checkSize());
                }
            },
            checkSize() {
                this.checkSizeRequest = 0;
                if (this.renderState === RenderState.STABLE) {
                    return; // Nothing to check, no more checks to schedule
                }
                // 这里不确定
                // const thisElement = ReactDOM.findDOMNode(this);
                const thisElement = this.$refs.targetWW;
                const {scrollHeight, clientHeight, scrollWidth, clientWidth} = thisElement;
                const tooBig = scrollHeight > clientHeight || scrollWidth > clientWidth;

                if (this.renderState === RenderState.MEASURE) {
                    // First measurement since mount / props changed
                    if (tooBig) {
                        this.renderState = RenderState.FLUID;
                        // Set initial params for binary search of length
                        this.longestGood = MINLENGTH;
                        this.textCutoffLength = this.shortestBad = this.innerText.length;
                    } else {
                        this.renderState = RenderState.STABLE;
                        // this.forceUpdate(); // Re-render via react so it can update the alpha
                    }
                }
                if (this.renderState === RenderState.FLUID) {
                    this.loopCount++;
                    const lastLength = this.textCutoffLength;
                    let keepMeasuring;
                    if (this.loopCount >= MAXLOOPS) {
                        // This really shouldn't happen!
                        console.error('TruncatingLabel - TOO MANY LOOPS');
                        keepMeasuring = false;
                    } else if (lastLength <= MINLENGTH) {
                        keepMeasuring = false;
                    } else if (Math.abs(this.shortestBad - this.longestGood) < 2) {
                        // We're done searching, hoorays!
                        keepMeasuring = false;
                    } else {
                        // Update search space
                        if (tooBig) {
                            this.shortestBad = Math.min(this.shortestBad, lastLength);
                        } else {
                            this.longestGood = Math.max(this.longestGood, lastLength);
                        }
                        // Calculate the next length and update the text
                        this.textCutoffLength = Math.floor((this.longestGood + this.shortestBad) / 2);
                        this.innerText = this.completeText.substr(0, this.textCutoffLength) + '…';
                        // Bypass react's render loop during the "fluid" state for performance
                        thisElement.innerText = this.innerText;
                        keepMeasuring = true;
                    }
                    if (keepMeasuring) {
                        this.invalidateSize();
                    } else {
                        this.renderState = RenderState.STABLE;
                        // this.forceUpdate(); // Re-render via react so it knows about updated alpha and final content
                    }
                }
            }
        },
    };
</script>
<style>

</style>
