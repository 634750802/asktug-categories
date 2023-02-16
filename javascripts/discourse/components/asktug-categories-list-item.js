import Component from "@ember/component";
import {inject as service} from "@ember/service";
import discourseComputed from "discourse-common/utils/decorators";
import {action} from "@ember/object";

export default Component.extend({
  router: service(),
  tagName: "li",
  classNames: ['asktug-categories-list-item'],
  attributeBindings: ['style'],

  @discourseComputed
  style() {
    return `--asktug-category-color: #${this.category.color}; --asktug-category-bg-color: #${this.category.color}20;`
  },

  @discourseComputed
  slug() {
    return `${this.category.slug}/${this.category.id}`
  },

  @discourseComputed
  href() {
    return `/c/${this.slug}`
  },

  @action
  performRoute(event) {
    event.preventDefault();
    this.router.transitionTo('discovery.category', this.slug);
  },
})
