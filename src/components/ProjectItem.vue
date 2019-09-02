<template>
  <div class="project-item">
    <q-form>
      <q-input label="Name" v-model="data.name"/>
      <q-input label="Domain name" v-model="data.domainName"/>
      <q-input label="Database name" v-model="data.databaseName"/>
      <q-input label="Port" v-model="data.port"/>
      <q-toggle label="Run on startup" v-model="data.runOnStartUp"/>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import AbstractItem from './AbstractItem';

@Component
export default class ProjectItem extends AbstractItem {}
</script>

<style lang="scss">
</style>