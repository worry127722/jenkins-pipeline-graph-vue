<script>
    export default {
        name: "svg-block",
        components: {},
        data() {
            return {}
        },
        props: ['node'],
        beforeMount() {
        },
        beforeDestroy() {
        },
        mounted() {
        },
        render: function (createElement) {


            return createElement("g", null,
                [
                    createElement("rect", {
                        attrs: {
                            x: "-113",
                            y: "25",
                            width: this.node.stage.popInfo.width || "101",
                            height: this.node.stage.popInfo.height || "58"
                        },
                        style: {
                            stroke: '#ff7e5a',
                            fill: '#ff7e5a',
                            strokeWidth: '1px',
                            rx: "5",
                            ry: "5",
                            fillOpacity: 0.9,
                            strokeOpacity: 0,
                        }
                    }),
                    createElement("switch", {}, [
                        createElement("foreignObject", {
                            attrs: {
                                x: "-113",
                                y: "25",
                                width: this.node.stage.popInfo.width || "101",
                                height: this.node.stage.popInfo.height || "120",
                                outline: "0px solid blue",
                                strokeOpacity: 0,
                            },
                            style: {
                                backgroundColor: '#fe8a6b',
                                fontSize: '12',
                                fontWeight: 800,
                                borderRadius: '5px',
                            }
                        }, [
                            createElement("p", {
                                style: {
                                    fontSize: '12',
                                    color: 'white',
                                    fontWeight: 800,
                                    marginBottom: '2px!important',
                                    marginTop: '2px',
                                    textAlign: 'center',
                                }
                            }, [this.node.stage.popInfo.title]),
                            createElement("p", {
                                style: {
                                    color: 'white',
                                    lineHeight: 0.1,
                                    marginBottom: '0px!important',
                                    marginTop: '0px!important',
                                    textAlign: 'center',
                                }
                            }, [this.node.stage.popInfo.title ? '--------------------------' : '']),

                            this.node.stage.popInfo.msg.map(x => {
                                return createElement("p", {
                                    style: {
                                        fontSize: "12",
                                        color: 'white',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        marginBottom: '1px!important',
                                        marginTop: '1px!important',
                                    }
                                }, [x]);
                            }),
                        ])
                    ]),

                    createElement("polygon", {
                        attrs: {points: "-20,8 -70,25 -40,25"},
                        style: {
                            fontSize: "12",
                            fill: '#ff7e5a',
                            fillOpacity: 0.9,
                            strokeOpacity: 0,
                        }
                    }),
                ]);


        },
        methods: {},
    };
</script>
<style>

</style>
