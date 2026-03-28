import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

export interface SidebarItem {
  label: string;
  route?: string;
  icon?: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, NgIcon],
  host: { class: 'sidebar-host' },
  template: `
    <aside class="sidebar" aria-label="Navegação lateral">
      <div class="sidebar-logo" aria-label="Logo">
        <span class="text-white font-bold text-xl tracking-tight">Appétit</span>
      </div>

      <div class="sidebar-section-label" aria-hidden="true">NAVEGUE PELOS MENUS</div>

      <nav aria-label="Menu principal">
        @for (item of items(); track item.label) {
          @if (item.children?.length) {
            <div class="sidebar-group">
              <button
                class="sidebar-item"
                type="button"
                [class.open]="isExpanded(item.label)"
                (click)="toggleItem(item.label)"
                [attr.aria-expanded]="isExpanded(item.label)"
                [attr.aria-controls]="'submenu-' + item.label"
              >
                @if (item.icon) {
                  <ng-icon [name]="item.icon" size="18" aria-hidden="true" />
                }
                <span>{{ item.label }}</span>
                <span class="chevron" aria-hidden="true">›</span>
              </button>

              @if (isExpanded(item.label)) {
                <ul
                  [id]="'submenu-' + item.label"
                  class="sidebar-children"
                  role="list"
                >
                  @for (child of item.children; track child.label) {
                    <li>
                      <a
                        class="sidebar-subitem"
                        [routerLink]="child.route"
                        routerLinkActive="active"
                        [routerLinkActiveOptions]="{ exact: true }"
                      >{{ child.label }}</a>
                    </li>
                  }
                </ul>
              }
            </div>
          } @else {
            <a
              class="sidebar-item"
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.route === '/' }"
            >
              @if (item.icon) {
                <ng-icon [name]="item.icon" size="18" aria-hidden="true" />
              }
              <span>{{ item.label }}</span>
            </a>
          }
        }
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar-host { overflow: hidden; display: block; }

    .sidebar {
      background-color: var(--color-sidebar-bg);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      width: 220px;
    }

    .sidebar-logo {
      padding: 1.5rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
    }

    .sidebar-section-label {
      padding: 1.25rem 1.25rem 0.375rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: rgba(160, 160, 176, 0.5);
    }

    nav {
      padding: 0.5rem 0.75rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }

    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: var(--color-sidebar-text);
      text-decoration: none;
      width: 100%;
      background: none;
      border: none;
      cursor: pointer;
      transition: background-color 0.15s, color 0.15s;
      text-align: left;

      &:hover {
        background-color: rgba(255, 255, 255, 0.06);
        color: var(--color-sidebar-text-active);
      }

      &.active {
        background-color: rgba(139, 92, 246, 0.2);
        color: var(--color-sidebar-text-active);
      }

      &.open { color: var(--color-sidebar-text-active); }

      .chevron {
        margin-left: auto;
        font-size: 1rem;
        line-height: 1;
        transition: transform 0.2s;
      }

      &.open .chevron { transform: rotate(90deg); }
    }

    .sidebar-children {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding: 0.25rem 0 0.25rem 2.25rem;
      list-style: none;
      margin: 0;
    }

    .sidebar-subitem {
      display: block;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.8125rem;
      color: var(--color-sidebar-text);
      text-decoration: none;
      transition: color 0.15s;

      &:hover { color: var(--color-sidebar-text-active); }

      &.active {
        color: var(--color-sidebar-text-active);
        font-weight: 500;
      }
    }
  `],
})
export class SidebarComponent {
  items = input<SidebarItem[]>([]);

  private expanded = signal<Set<string>>(new Set());

  isExpanded(label: string): boolean {
    return this.expanded().has(label);
  }

  toggleItem(label: string): void {
    this.expanded.update(set => {
      const next = new Set(set);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }
}
