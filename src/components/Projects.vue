<template>
  <div class="projects">
    <q-splitter v-model="splitterModel" :limits="[30, 70]" v-if="!isLoading">
      <template v-slot:before>
        <q-scroll-area style="height: 300px;">
          <q-tree :nodes="tree" node-key="key" label-key="name" default-expand-all>
            <template v-slot:default-header="prop">
              <div style="cursor: pointer">
                <template v-if="prop.node.component !== 'project-item'">
                  <q-icon name="folder" />
                </template>
                <template v-else>
                  <q-icon
                    v-if="!loadingStates.includes(prop.node.key)"
                    :name="prop.node.started ? 'pause_circle_filled' : 'play_circle_outline'"
                    :color="prop.node.started ? 'negative' : 'primary'"
                  />
                  <q-circular-progress
                    v-else
                    indeterminate
                    size="17px"
                    style="margin-right: 4px"
                    color="primary"
                  />
                </template>
                &nbsp;
                <span>{{ prop.node.name }}</span>
              </div>
              <q-menu touch-position context-menu>
                <q-list dense style="min-width: 100px">
                  <q-item
                    clickable
                    v-close-popup
                    v-if="prop.node.component !== 'welcomer'"
                    @click="editNode(prop)"
                  >
                    <q-item-section>Edit</q-item-section>
                  </q-item>
                  <q-item clickable v-if="prop.node.component !== 'project-item'">
                    <q-item-section>New</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right"></q-icon>
                    </q-item-section>

                    <q-menu anchor="top right" self="top left">
                      <q-list>
                        <q-item dense clickable v-close-popup @click="addDirectory(prop)">
                          <q-item-section>Directory</q-item-section>
                        </q-item>
                        <q-item dense clickable v-close-popup @click="addProject(prop)">
                          <q-item-section>Project</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    v-if="prop.node.component === 'project-item'"
                    @click="prop.node.started ? stopProject(prop) : startProject(prop)"
                  >
                    <q-item-section>{{ prop.node.started ? 'Stop' : 'Start' }}</q-item-section>
                  </q-item>
                  <q-separator v-if="prop.node.component !== 'welcomer'" />
                  <q-item
                    class="bg-danger"
                    clickable
                    v-close-popup
                    v-if="prop.node.component !== 'welcomer'"
                    @click="deleteNode(prop)"
                  >
                    <q-item-section>Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </template>
          </q-tree>
        </q-scroll-area>
      </template>
      <template v-slot:after>
        <q-scroll-area style="height: 300px">
          <q-tab-panels
            v-model="selectedNode.component"
            animated
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="welcomer">
              <div class="text-h4 q-mb-md">Welcome</div>
              <p>Right click on a node to add a new directory, project, or delete it.</p>
            </q-tab-panel>
            <q-tab-panel name="project-item">
              <project-item :data="selectedNode" />
            </q-tab-panel>

            <q-tab-panel name="directory-item">
              <directory-item :data="selectedNode" />
            </q-tab-panel>
          </q-tab-panels>
        </q-scroll-area>
      </template>
    </q-splitter>
    <div v-else style="text-align: center">
      <q-circular-progress indeterminate size="256px" color="primary" />
      <h4>Loading your projects...</h4>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ProjectItem from './ProjectItem.vue';
import DirectoryItem from './DirectoryItem.vue';
import { Project } from '@/interfaces/project';
import { ipcRenderer } from 'electron';

import Welcomer from './Welcomer.vue';

import * as uuidv4 from 'uuid/v4';

import { bootstrap } from 'graphql-cms-back-sdk';

interface TreeNode {
  key: string;
  name: string;
  component: string;
  children?: TreeNode[];
}

@Component({
  components: {
    ProjectItem,
    DirectoryItem,
    Welcomer,
  },
})
export default class Projects extends Vue {
  private splitterModel = 50;

  private tree = [
    {
      key: 'projects',
      name: 'Projects',
      component: 'welcomer',
      children: [],
    },
  ];

  private selectedNode: TreeNode = this.tree[0];

  private loadingStates: string[] = [];
  private isLoading = true;

  public created() {
    ipcRenderer.on('retrievedProjects', (event, data) => {
      this.tree = JSON.parse(data);
      this.isLoading = false;
    });
    ipcRenderer.send('getProjects');
  }

  @Watch('tree', { deep: true })
  private onChangeTree() {
    ipcRenderer.send('updateProjects', JSON.stringify(this.tree));
  }

  private addDirectory(prop: any) {
    prop.node.children = [
      ...prop.node.children,
      {
        key: uuidv4(),
        name: 'New directory',
        component: 'directory-item',
        children: [],
      },
    ];

    this.selectedNode = prop.node.children[prop.node.children.length - 1];
  }

  private addProject(prop: any) {
    const newNode = {
      key: uuidv4(),
      component: 'project-item',
      name: 'New project',
      databaseName: '',
      domainName: '',
      port: '',
      runOnStartUp: false,
    };
    prop.node.children = [...prop.node.children, newNode];

    ipcRenderer.once('createProjectDone', () => {
      this.selectedNode = newNode;
    });

    ipcRenderer.send('createProject', newNode);
  }

  private deleteNode(prop: any) {
    const walkNodes = (node: any, callback: (child, node) => void) => {
      if (!node.children) {
        return;
      }
      node.children.forEach((child: any) => {
        callback(child, node);
        walkNodes(child, callback);
      });
    };

    if (this.tree[0].children.length) {
      walkNodes(this.tree[0], (node: any, parent: any) => {
        if (node.key === prop.key) {
          const index = parent.children.indexOf(node);
          parent.children.splice(index, 1);
        }
      });
    }
    ipcRenderer.send('deleteProject', prop.node);
    this.selectedNode = this.tree[0];
  }

  private startProject(prop: any) {
    this.loadingStates.push(prop.key);
    ipcRenderer.send('startProject', prop.node);

    ipcRenderer.once('startedProject:' + prop.key, () => {
      this.loadingStates.splice(this.loadingStates.indexOf(prop.key), 1);
      this.$set(prop.node, 'started', true);
    });
  }

  private stopProject(prop: any) {
    this.loadingStates.push(prop.key);
    ipcRenderer.send('stopProject', prop.node);

    ipcRenderer.once('stoppedProject:' + prop.key, () => {
      this.loadingStates.splice(this.loadingStates.indexOf(prop.key), 1);
      this.$set(prop.node, 'started', false);
    });
  }

  private editNode(prop: any) {
    this.selectedNode = prop.node;
  }
}
</script>

<style lang="stylus"></style>