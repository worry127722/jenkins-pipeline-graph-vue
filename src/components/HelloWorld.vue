<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <PipelineGraph
            :stages='stage'
            :layout='layout'
        />

        <p>22</p>
        <p>
            For a guide and recipes on how to configure / customize this project,<br>
            check out the
            <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
        </p>
        <h3>Installed CLI Plugins</h3>
        <ul>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank"
                   rel="noopener">babel</a></li>
            <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank"
                   rel="noopener">eslint</a></li>
        </ul>
        <h3>Essential Links</h3>
        <ul>
            <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
            <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
            <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
            <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
            <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
        </ul>
        <h3>Ecosystem</h3>
        <ul>
            <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
            <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
            <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank"
                   rel="noopener">vue-devtools</a></li>
            <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
            <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
        </ul>
    </div>
</template>

<script>
    // import SvgSpinner from "./support/SvgSpinner";
    import PipelineGraph from "./PipelineGraph";
    import {nodeStrokeWidth} from "./support/StatusIcons.js";
    import {Result} from "./PipelineGraphModel";

    import '../assets/styles/css/main.css'

    export default {
        name: 'HelloWorld',
        components: {
            // SvgSpinner,
            PipelineGraph
        },
        data() {
            return {
                layout: {
                    nodeSpacingH: 150,
                    parallelSpacingH: 2000,
                    nodeRadius: 16,
                    terminalRadius: 10,
                    curveRadius: 20,
                    connectorStrokeWidth: 8,
                    labelOffsetV: 30,
                    smallLabelOffsetV: 20,
                },
                stage: [{
                    "name": "封版",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1587,
                    "type": "STAGE"
                }, {
                    "name": "灰度1前确认",
                    "children": [{
                        "name": "block问题确认",
                        "children": [],
                        "state": "SUCCESS",
                        "completePercent": 50,
                        "id": 1589,
                        "type": "PARALLEL"
                    }, {
                        "name": "monkey测试",
                        "children": [],
                        "state": "SUCCESS",
                        "completePercent": 50,
                        "id": 1590,
                        "type": "PARALLEL"
                    }],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1588,
                    "type": "STAGE"
                }, {
                    "name": "灰度1",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1591,
                    "type": "STAGE"
                }, {
                    "name": "灰度2前确认",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1592,
                    "type": "STAGE"
                }, {
                    "name": "灰度2",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1593,
                    "type": "STAGE"
                }, {
                    "name": "提审",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1594,
                    "type": "STAGE"
                }, {
                    "name": "上架前确认",
                    "children": [],
                    "state": "PAUSED",
                    "completePercent": 50,
                    "id": 1595,
                    "type": "STAGE"
                }, {
                    "name": "上架",
                    "children": [],
                    "state": "not_built",
                    "completePercent": 50,
                    "id": 1596,
                    "type": "STAGE"
                }, {
                    "name": "全量确认",
                    "children": [{
                        "name": "block问题确认",
                        "children": [],
                        "state": "not_built",
                        "completePercent": 50,
                        "id": 1598,
                        "type": "PARALLEL"
                    }, {
                        "name": "核心数据确认",
                        "children": [],
                        "state": "not_built",
                        "completePercent": 50,
                        "id": 1599,
                        "type": "PARALLEL"
                    }],
                    "state": "not_built",
                    "completePercent": 50,
                    "id": 1597,
                    "type": "STAGE"
                }, {
                    "name": "全量放量",
                    "children": [],
                    "state": "not_built",
                    "completePercent": 50,
                    "id": 1600,
                    "type": "STAGE"
                }]
            }
        },
        props: {
            msg: String
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /*@import '../assets/styles/css/main.css';*/
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
