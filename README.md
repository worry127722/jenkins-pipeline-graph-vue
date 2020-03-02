# Jenkins-pipeline-graph-vue
Jenkins-ci pipeline for vue.js

介绍：vue版本的 Jenkins-ci pipeline，reactjs版本地址[(链接)](https://github.com/jenkinsci/ux-widget-framework/tree/master/packages/pipeline-graph)

## 安装：
```
npm i jenkins-pipeline-graph-vue
```

## 使用：
```
import JenkinsPipelineGraphVue from "jenkins-pipeline-graph-vue";

<JenkinsPipelineGraphVue  :stages='stage'  :layout='layout'/>
```

## 参数：
layout：样式

stages：节点信息

## 实例：
```
src/components/HelloWorld.vue
```
