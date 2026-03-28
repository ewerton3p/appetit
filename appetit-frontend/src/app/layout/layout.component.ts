import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarItem } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div
      class="layout-wrapper"
      [style.grid-template-columns]="sidebarCollapsed() ? '1fr' : '220px 1fr'"
    >
      @if (!sidebarCollapsed()) {
        <app-sidebar [items]="navItems" />
      }

      <div class="layout-main">
        <app-header (toggleSidebar)="sidebarCollapsed.update(v => !v)" />
        <main class="layout-content" id="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: grid;
      grid-template-columns: 220px 1fr;
      height: 100vh;
      transition: grid-template-columns 0.2s ease;
    }

    .layout-main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .layout-content {
      flex: 1;
      overflow-y: auto;
      background: var(--color-surface);
      padding: var(--spacing-section);
    }
  `],
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);

  navItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/', icon: 'heroHome' },
    {
      label: 'Produtos',
      icon: 'heroShoppingCart',
      children: [
        { label: 'Listar produtos', route: '/products' },
        { label: 'Novo produto', route: '/products/new' },
      ],
    },
    { label: 'Usuários', route: '/users', icon: 'heroUsers' },
    { label: 'Configurações', route: '/settings', icon: 'heroCog6Tooth' },
  ];
}
