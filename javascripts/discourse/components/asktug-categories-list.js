import Component from "@ember/component";
import {inject as service} from "@ember/service";
import {and} from "@ember/object/computed";
import discourseComputed, {observes} from "discourse-common/utils/decorators";
import {action} from "@ember/object";
import CategoryList from "discourse/models/category-list";


export default Component.extend({
  router: service(),
  tagName: "div",
  classNames: ["asktug-categories-list-container"],

  fetchedCategories: null,

  @discourseComputed
  categories() {
    return (this.fetchedCategories || this.site.categories)
      .filter(c => !c.parent_category_id && !c.isUncategorizedCategory && !c.read_restricted)
      .sort((c1, c2) => c1.position - c2.position)
  },

  @discourseComputed
  activeRoutes() {
    return new RegExp(`^discovery\.(${this.siteSettings.top_menu})$`)
  },

  @discourseComputed("router.currentRouteName")
  displayForRoute(currentRouteName) {
    return this.activeRoutes.test(currentRouteName) && currentRouteName !== 'discovery.categories'
  },

  shouldDisplay: and("displayForRoute"),

  // Setting a class on <html> from a component is not great
  // but we need it for backwards compatibility
  @observes("shouldDisplay")
  displayChanged() {
    document.documentElement.classList.toggle(
      "display-asktug-categories-list",
      this.shouldDisplay
    );
  },

  didInsertElement() {
    CategoryList.list(this.store).then((result) => {
      this.fetchedCategories = result.categories
    })
    this.displayChanged();
  },
})
