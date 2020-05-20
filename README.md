# Jenkins-pipeline-graph-vue
Jenkins-ci pipeline for vue.js

介绍：vue版本的 Jenkins-ci pipeline，reactjs版本地址[(链接)](https://github.com/jenkinsci/ux-widget-framework/tree/master/packages/pipeline-graph)

## 效果图：
![avatar](/src/assets/inc.png)

## 安装：
```
npm i jenkins-pipeline-graph-vue
```

## 使用：
```
import JenkinsPipelineGraphVue from "jenkins-pipeline-graph-vue";

<JenkinsPipelineGraphVue
       :stages='stage'
       :layout='layout'
       :onNodeClick='nodeClick'
       :selectedStage='selectedNode'
/>
```

## 参数：
layout：样式

stages：节点信息

onNodeClick：点击节点时调用，返回两个参数：displayName 、 id

selectedStage：初始化选中节点

## 实例：
```
src/components/HelloWorld.vue
```
