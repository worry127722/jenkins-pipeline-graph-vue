<template>
    <div class="hello">
        <h1>JenkinsPipelineGraphVue</h1>

        <JenkinsPipelineGraphVue
            :stages='stage'
            :layout='layout'
            :onNodeClick='nodeClick'
            :selectedStage='selectedNode'
        />

    </div>
</template>

<script>
    import JenkinsPipelineGraphVue from "./PipelineGraph";

    export default {
        name: 'HelloWorld',
        components: {
            JenkinsPipelineGraphVue
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
                    "name": "流程1",
                    "children": [],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1587,
                    "type": "STAGE",
                    'popInfo': {
                        title: '<发生Block事件>',
                        msg: [ '已解决：12个', '未解决：3个' ],
                        width: "101",
                        height: "58",
                    }
                }, {
                    "name": "流程2",
                    "children": [{
                        "name": "子流程2-1",
                        "children": [],
                        "state": "SUCCESS",
                        "completePercent": 50,
                        "id": 1589,
                        "type": "PARALLEL"
                    }, {
                        "name": "子流程2-2",
                        "children": [],
                        "state": "SUCCESS",
                        "completePercent": 50,
                        "id": 1590,
                        "type": "PARALLEL",
                        'popInfo': {
                            title: '<发生lock事件>',
                            msg: [ '已解决：1个', '未解决：4个' ],
                            width: "101",
                            height: "58",
                        }
                    }],
                    "state": "SUCCESS",
                    "completePercent": 50,
                    "id": 1588,
                    "type": "STAGE"
                }, {
                    "name": "流程3",
                    "children": [],
                    "state": "PAUSED",
                    "completePercent": 50,
                    "id": 1595,
                    "type": "STAGE"
                }, {
                    "name": "流程4",
                    "children": [],
                    "state": "not_built",
                    "completePercent": 50,
                    "id": 1596,
                    "type": "STAGE"
                }, {
                    "name": "流程5",
                    "children": [{
                        "name": "子流程5-1",
                        "children": [],
                        "state": "not_built",
                        "completePercent": 50,
                        "id": 1598,
                        "type": "PARALLEL"
                    }, {
                        "name": "子流程5-2",
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
                    "name": "流程6",
                    "children": [],
                    "state": "not_built",
                    "completePercent": 50,
                    "id": 1600,
                    "type": "STAGE"
                }],
                selectedNode: {
                    "displayName": "自测1",
                    "displayDescription": null,
                    "durationInMillis": 2284,
                    "result": "SUCCESS",
                    "startTime": "2020-03-11T17:29:11.972+0800",
                    "state": "FINISHED",
                    "type": "STAGE",
                    "firstParent": null,
                    "id": 1587,
                    "desc": "自测阶段，需要MergeRequest中有\"自测完成\"标签"
                }
            }
        },
        props: {
            msg: String
        },
        methods: {
            nodeClick(nodeName, id) {
                console.log(nodeName)
                console.log(id)
                alert('节点名称：' + nodeName)
                alert('节点id：' + id)
            },
        }
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
