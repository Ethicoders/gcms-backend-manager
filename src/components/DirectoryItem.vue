<template>
  <div class="directory-item">
    <q-form>
      <q-input label="Name" v-model="data.name"/>
    </q-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import AbstractItem from './AbstractItem';

@Component
export default class DirectoryItem extends AbstractItem {}
</script>

<style lang="scss">
</style>