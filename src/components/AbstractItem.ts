import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class AbstractItem extends Vue {
  @Prop({
    type: Object,
  })
  protected data?: any;
}
