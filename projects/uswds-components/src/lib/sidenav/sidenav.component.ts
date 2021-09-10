import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NavigationMode, SidenavModel } from './sidenav.model';


@Component({
  selector: `uswds-sidenav`,
  templateUrl: `sidenav.component.html`,
  styleUrls: ['sidenav.component.scss']
})
export class USWDSSidenavComponent implements OnInit {

  NavigationMode = NavigationMode;

  @Input() sidenavContent: SidenavModel[];

  /**
   * Enables navigation items to be toggled. By default all items are fully collapsed unless specified in sidenavContent.
   *
   * 'single' will allow only one branch to be expanded at a time. If a new branch is expanded, all open branches will collapse
   *
   * 'multiple' will allow all branches to be expanded independently of each other.
   */
  @Input() expandType: 'single' | 'multiple';

  /**
   * Enables links with a mode of NavigationMode.LABEL to be collapsed, by default they are expanded and locked.
   */
  @Input() collapseLabels = false;

  @Output() sidenavClicked = new EventEmitter<SidenavModel>();

  ngOnInit(): void {
    // If collapse is enabled, collapse all children by default. If label, expand to show children
    if (this.expandType) {
      this.sidenavContent.map(link => {
        if (link.mode !== NavigationMode.LABEL) {
          link.collapsed = link.collapsed === undefined ? true : link.collapsed;
        }
        if (link.children) {
          this.collapseChildren(link);
        }
      });
    }
  }

  private collapseChildren(link: SidenavModel): void {
    link.children = link.children.map(childLink => {
      childLink.collapsed = true;
      return childLink;
    });
  }

  onSidenavItemClicked(item: SidenavModel): void {

    this.deselectSideNav(this.sidenavContent);
    this.selectSideNav(item, this.sidenavContent);
    this.deactivateChild(this.sidenavContent);
    if (item.children && this.canCollapseLabel(item)) {
      item.collapsed = !item.collapsed;
      this.toggleBasedOnSelected(item.children);
    }
    if (this.expandType === 'single') {

      this.toggleBasedOnSelected(this.sidenavContent);
    }
    this.sidenavClicked.emit(item);
  }

  /**
   *
   * @param link - Link which has been clicked on
   * @returns true if either link is not a label, or it is a label and label collapse is enabled
   */
  private canCollapseLabel(link: SidenavModel): boolean {
    return link.mode === NavigationMode.LABEL ? this.collapseLabels : true;
  }

  private toggleBasedOnSelected(links: SidenavModel[]): void {
    links.forEach(link => {
      link.collapsed = link.selected ? false : true;
      if (link.children) {
        this.toggleBasedOnSelected(link.children);
      }
      return;
    });
  }

  /**
   * Deselects any previously selected sidenav item
   * @param sidenavItems
   */
  private deselectSideNav(sidenavItems: SidenavModel[]): void {
    sidenavItems.forEach(sideNavItem => {
      if (sideNavItem.children) {
        this.deselectSideNav(sideNavItem.children);
      }
      sideNavItem.selected = false;
    });
  }

  /**
   * Selects the clicked sidenav item as we as any parent
   * @param selectedItem
   * @param allNavItems
   */
  private selectSideNav(selectedItem: SidenavModel, allNavItems: SidenavModel[]): boolean {
    for (const item of allNavItems) {

      if (item === selectedItem) {
        item.selected = true;
        return true;
      } else if (item.children) {
        const isChildSelected = this.selectSideNav(selectedItem, item.children);
        if (isChildSelected) {
          item.selected = true;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * If selected item is a grandchild link, the child link needs to not be active per uswds.
   * If selected link is a child link, child link needs to remain selected.
   * @param allNavItems
   */
  private deactivateChild(allNavItems: SidenavModel[]): void {
    const topLevelLink = allNavItems.find(item => item.selected);
    if (topLevelLink.children) {
      const selectedChildLink = topLevelLink.children.find(item => item.selected);
      if (selectedChildLink?.children) {
        const selectedGrandchildLink = selectedChildLink.children.find(item => item.selected);
        if (selectedGrandchildLink) {
          selectedChildLink.selected = false;
        }
      }
    }
  }

  /**
   * When expandType is multiple, expands all collapseable links in sidenav
   */
  public expandAll(): void {
    if (this.expandType === 'multiple') {
      this.sidenavContent.forEach(link => this.expandChildren(link, false));
    }
  }

  /**
   * Collapses all links
   */
  public collapseAll(): void {
    this.sidenavContent.forEach(link => this.expandChildren(link, true));
  }

  private expandChildren(link: SidenavModel, collapsedValue: boolean): void {
    if (link.children) {
      link.collapsed = collapsedValue;
      link.children.forEach(childLink => childLink.children ? this.expandChildren(childLink, collapsedValue) : null);
    }
  }
  private queryStringBuilder(item: SidenavModel): string {
    const ret = [];
    let keys = [];
    if (item.queryParams) {
      keys = Object.keys(item.queryParams);
    }
    for (const d of keys) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(item.queryParams[d]));
    }
    return ret.join('&');
  }

  /**
   * creates url from provided route and query params
   * @param item - Link to use when building url
   */
  urlBuilder(item: SidenavModel): string {
    let url = item.href;
    const queryParams = this.queryStringBuilder(item);
    if (queryParams) {
      if (url.indexOf('?') === -1) {
        url += '?' + queryParams;
      } else if (url.indexOf('?') === url.length - 1) {
        url += queryParams;
      } else {
        url += '&' + queryParams;
      }
    }
    return url;
  }

}
