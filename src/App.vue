<template>
  <div id="app">
    <div class="row justify-center">
      <q-layout view="hHh lpR fFf">
        <q-header>
          <q-bar class="q-electron-drag">
            <div class="cursor-pointer">File</div>
            <div class="cursor-pointer">Edit</div>
            <div class="cursor-pointer">Help</div>
            <q-menu touch-position context-menu>
              <q-list dense style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                >
                  <q-item-section>Look for updates...</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-space />
            <q-btn dense flat icon="close" @click="close" />
          </q-bar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <projects />
          </q-page>
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Project } from '@/interfaces/project';
import { ipcRenderer, remote } from 'electron';
import Projects from '@/components/Projects.vue';

@Component({
  components: {
    Projects,
  },
})
export default class App extends Vue {
  private close() {
    if (process.env.IS_ELECTRON) {
      (remote as any).BrowserWindow.getFocusedWindow().close();
    }
  }
}
</script>

<style lang="stylus">
// @import url('/src/styles/quasar.variables.styl')
</style>
